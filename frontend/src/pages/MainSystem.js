import React, { useState, useEffect } from 'react';
import API_BASE from '../config/api';

// ==========================================
// STYLES
// ==========================================
const styles = {
    container: {
        height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
        background: 'linear-gradient(-45deg, #0f2027, #203a43, #2c5364, #1c1c1c)',
        backgroundSize: '400% 400%', animation: 'gradientBG 15s ease infinite', color: '#fff', fontFamily: 'Segoe UI, sans-serif'
    },
    dash: { minHeight: '100vh', padding: '40px', background: '#0f2027', color: '#fff', fontFamily: 'Segoe UI' },
    card: { background: 'rgba(20, 20, 20, 0.95)', width: '400px', padding: '30px', borderRadius: '12px', boxShadow: '0 15px 30px rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)' },
    input: { width: '100%', padding: '12px', marginTop: '10px', borderRadius: '6px', border: '1px solid #444', background: '#2c2c2c', color: '#fff', boxSizing: 'border-box' },
    btn: { width: '100%', background: '#4b6cb7', color: 'white', border: 'none', padding: '12px', marginTop: '20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    adminCard: { background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', marginBottom: '10px', borderLeft: '5px solid #4b6cb7' },
    approveBtn: { background: '#27ae60', color: '#fff', border: 'none', padding: '5px 10px', marginRight: '10px', borderRadius: '4px', cursor: 'pointer' },
    deleteBtn: { background: '#c0392b', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' },
    label: { display: 'block', marginTop: '10px', fontWeight: 'bold', color: '#ddd' }
};

// ==========================================
// 1. LOGIN PORTAL (With Password & OTP)
// ==========================================
function Login({ onLogin }) {
    const [role, setRole] = useState('user');
    const [method, setMethod] = useState('email'); // Default to email
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');

    const handleLogin = () => {
        // ADMIN LOGIN LOGIC
        if (role === 'admin') {
            if (method === 'email' && email === 'admin@test.com' && password === 'admin123') {
                onLogin('admin');
            } else if (method === 'otp' && otp === '1234') {
                onLogin('admin');
            } else {
                alert("Invalid Admin Credentials! (Demo: admin@test.com / admin123)");
            }
        } 
        // USER LOGIN LOGIC
        else {
            if (method === 'email' && password === 'user123') {
                onLogin('user');
            } else if (method === 'otp' && otp === '1234') {
                onLogin('user');
            } else {
                alert("Invalid User Credentials! (Demo: user123 or OTP 1234)");
            }
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{textAlign:'center', marginBottom: '20px'}}>Lost & Found Portal</h2>
                
                <label style={styles.label}>Select Role</label>
                <select style={styles.input} onChange={(e) => setRole(e.target.value)}>
                    <option value="user">Student / User</option>
                    <option value="admin">Administrator</option>
                </select>

                <div style={{display:'flex', justifyContent:'center', gap:'20px', marginTop:'20px'}}>
                    <label style={{cursor:'pointer'}}><input type="radio" name="m" defaultChecked onChange={()=>setMethod('email')}/> Email/Pass</label>
                    <label style={{cursor:'pointer'}}><input type="radio" name="m" onChange={()=>setMethod('otp')}/> OTP</label>
                </div>

                {method === 'email' ? (
                    <div style={{marginTop: '10px'}}>
                        <input style={styles.input} placeholder="Email Address" onChange={(e)=>setEmail(e.target.value)}/>
                        <input style={styles.input} type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
                    </div>
                ) : (
                    <div style={{marginTop: '10px'}}>
                        <input style={styles.input} placeholder="Phone Number"/>
                        <input style={styles.input} placeholder="Enter OTP (1234)" onChange={(e)=>setOtp(e.target.value)}/>
                    </div>
                )}

                <button style={styles.btn} onClick={handleLogin}>Login as {role === 'admin' ? 'Admin' : 'User'}</button>
                <p style={{fontSize: '11px', textAlign: 'center', marginTop: '15px', color: '#888'}}>
                    Admin: admin@test.com / admin123 <br/> User Pass: user123 | OTP: 1234
                </p>
            </div>
        </div>
    );
}

// ==========================================
// 2. USER DASHBOARD
// ==========================================
function UserDashboard({ onLogout }) {
    const [type, setType] = useState('lost');
    const [form, setForm] = useState({ category: '', location: '', description: '' });
    const [matches, setMatches] = useState([]);
    const [status, setStatus] = useState('');

    const handleReport = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('item_type', type);
        fd.append('category', form.category);
        fd.append('location', form.location);
        fd.append('description', form.description);

        const res = await fetch(`${API_BASE}/report`, { method: 'POST', body: fd });
        const data = await res.json();
        setMatches(data.matches || []);
        setStatus(data.message);
    };

    return (
        <div style={styles.dash}>
            <button onClick={onLogout} style={{float:'right', background:'#e53e3e', color:'white', border:'none', padding:'10px 20px', borderRadius: '5px', cursor: 'pointer'}}>Logout</button>
            <h1 style={{textAlign:'center', marginBottom: '30px'}}>Report Item</h1>
            
            <div style={{maxWidth:'500px', margin:'0 auto', background:'rgba(0,0,0,0.5)', padding:'30px', borderRadius:'12px', border: '1px solid #333'}}>
                <div style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
                    <button onClick={()=>setType('lost')} style={{flex:1, padding:'12px', background: type==='lost'?'#4b6cb7':'#2c2c2c', color:'white', border:'none', borderRadius: '6px', cursor:'pointer'}}>I Lost Something</button>
                    <button onClick={()=>setType('found')} style={{flex:1, padding:'12px', background: type==='found'?'#4b6cb7':'#2c2c2c', color:'white', border:'none', borderRadius: '6px', cursor:'pointer'}}>I Found Something</button>
                </div>
                <form onSubmit={handleReport}>
                    <input style={styles.input} placeholder="Item Name (e.g. Wallet)" onChange={e=>setForm({...form, category:e.target.value})} required/>
                    <input style={styles.input} placeholder="Location" onChange={e=>setForm({...form, location:e.target.value})} required/>
                    <textarea style={{...styles.input, height:'100px', resize: 'none'}} placeholder="Details (Color, brand, etc.)" onChange={e=>setForm({...form, description:e.target.value})} required/>
                    <button type="submit" style={styles.btn}>Submit & Scan for Matches</button>
                </form>
                {status && <p style={{color:'#4b6cb7', textAlign:'center', fontWeight: 'bold', marginTop: '15px'}}>{status}</p>}
            </div>

            {matches.length > 0 && (
                <div style={{maxWidth:'500px', margin:'30px auto'}}>
                    <h3 style={{borderBottom: '1px solid #444', paddingBottom: '10px'}}>Matches Found!</h3>
                    {matches.map((m, i) => (
                        <div key={i} style={{background:'rgba(39, 103, 73, 0.3)', padding:'15px', borderRadius:'8px', marginTop:'15px', borderLeft: '5px solid #27ae60'}}>
                            <span style={{color: '#27ae60', fontWeight: 'bold'}}>{m.score}% Match Accuracy</span>
                            <p style={{margin: '5px 0'}}><b>{m.item.category}</b> at {m.item.location}</p>
                            <p style={{fontSize: '13px', color: '#ccc'}}>{m.item.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ==========================================
// 3. ADMIN DASHBOARD
// ==========================================
function AdminDashboard({ onLogout }) {
    const [items, setItems] = useState([]);

    const fetchItems = () => fetch(`${API_BASE}/all-items`).then(res=>res.json()).then(setItems);
    useEffect(() => { fetchItems(); }, []);

    const handleDelete = async (id) => {
        await fetch(`${API_BASE}/delete/${id}`, { method: 'DELETE' });
        fetchItems();
    };

    const handleApprove = async (id) => {
        await fetch(`${API_BASE}/approve/${id}`, { method: 'POST' });
        alert("Verification Successful - Process Approved!");
        fetchItems();
    };

    return (
        <div style={styles.dash}>
            <button onClick={onLogout} style={{float:'right', background:'#e53e3e', color:'white', border:'none', padding:'10px 20px', borderRadius: '5px', cursor: 'pointer'}}>Logout</button>
            <h2 style={{borderBottom: '2px solid #4b6cb7', paddingBottom: '10px'}}>Admin Management Feed</h2>
            <div style={{marginTop:'30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
                {items.length === 0 ? <p>No records found.</p> : items.map((item, i) => (
                    <div key={i} style={styles.adminCard}>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span style={{fontSize: '10px', fontWeight: 'bold', color: item.item_type === 'lost' ? '#e53e3e' : '#27ae60'}}>{item.item_type.toUpperCase()}</span>
                            <span style={{fontSize: '10px', background: '#333', padding: '2px 5px', borderRadius: '3px'}}>{item.status}</span>
                        </div>
                        <h3 style={{margin: '10px 0'}}>{item.category}</h3>
                        <p style={{fontSize:'13px', color:'#ccc'}}>{item.description}</p>
                        <p style={{fontSize:'12px'}}>📍 {item.location}</p>
                        <div style={{marginTop: '15px'}}>
                            <button style={styles.approveBtn} onClick={()=>handleApprove(item.id)}>Approve</button>
                            <button style={styles.deleteBtn} onClick={()=>handleDelete(item.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ==========================================
// 4. MAIN CONTROLLER
// ==========================================
export default function App() {
    const [role, setRole] = useState(null);
    if (!role) return <Login onLogin={setRole} />;
    return role === 'admin' ? <AdminDashboard onLogout={()=>setRole(null)}/> : <UserDashboard onLogout={()=>setRole(null)}/>;
}