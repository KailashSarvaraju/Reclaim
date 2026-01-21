import json
import os
import uuid
from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fuzzywuzzy import fuzz

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = "database.json"

def load_db():
    if not os.path.exists(DATA_FILE): return []
    try:
        with open(DATA_FILE, "r") as f: return json.load(f)
    except: return []

def save_db(data):
    with open(DATA_FILE, "w") as f: json.dump(data, f, indent=4)

db = load_db()

# --- 1. TEST ROUTE (Open http://localhost:8000/test in browser to check) ---
@app.get("/test")
def test():
    return {"status": "Server is running correctly!"}

# --- 2. APPROVE ROUTE (Moved to top for priority) ---
@app.post("/approve/{item_id}")
async def approve_item(item_id: str):
    global db
    db = load_db() # Always reload to get fresh data
    
    found = False
    for item in db:
        if str(item["id"]) == str(item_id):
            item["status"] = "Approved"
            found = True
            break
    
    if found:
        save_db(db)
        print(f"DEBUG: Successfully Approved {item_id}")
        return {"status": "success"}
    else:
        print(f"DEBUG: ID {item_id} not found in database")
        return {"status": "error", "message": "ID not found"}

# --- 3. OTHER ROUTES ---
@app.post("/report")
async def report_item(
    item_type: str = Form(...), category: str = Form(...), 
    description: str = Form(...), location: str = Form(...),
):
    global db
    db= load_db() 

    item_id = str(uuid.uuid4())
    matches = []
    opposite = "found" if item_type == "lost" else "lost"
    for i in db:
        if i["item_type"] == opposite and i["category"].lower() == category.lower():
            score = fuzz.token_set_ratio(description, i["description"])
            if score > 30: matches.append({"item": i, "score": score})

    new_item = {
        "id": item_id, "item_type": item_type, "category": category, 
        "description": description, "location": location,
        "status": "Pending"
    }
    db.append(new_item)
    save_db(db)
    return {"message": "Success", "item": new_item, "matches": matches}

@app.get("/all-items")
async def get_items():
    return load_db()

@app.delete("/delete/{item_id}")
async def delete_item(item_id: str):
    global db
    db = [i for i in db if str(i["id"]) != str(item_id)]
    save_db(db)
    return {"status": "success"}

# --- 4. START COMMAND (Must be at the very bottom) ---
if __name__ == "__main__":
    import uvicorn
    print("LOG: API is starting up...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
