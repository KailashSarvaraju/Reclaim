// Centralized API configuration
// Defaults to localhost:8000 for development; can be overridden via environment variable
const API_BASE = process.env.REACT_APP_API_BASE || `http://${window.location.hostname}:8000`;

export default API_BASE;
