import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"; // Import Login styles
import api from "../../utils/api";

const Login = () => {
  const [formData, setFormData] = useState({
    emailId: "",
    password: "",
  });

  const [error, setError] = useState(""); // For showing errors
  const [checkingToken, setCheckingToken] = useState(true);
  const navigate = useNavigate();

  // Check token status on mount - if valid, redirect to home; if invalid/blacklisted, clear it
  useEffect(() => {
    const checkTokenStatus = async () => {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        setCheckingToken(false);
        return;
      }

      try {
        // Check if token is valid and not blacklisted
        const response = await api.get("/check-token");
        
        if (response.data?.valid) {
          // Token is valid, redirect to home
          navigate("/home");
        } else {
          // Token is invalid or blacklisted, clear it
          localStorage.removeItem("authToken");
          localStorage.removeItem("profilePicture");
          setCheckingToken(false);
        }
      } catch (error) {
        // Token is invalid or blacklisted, clear it
        localStorage.removeItem("authToken");
        localStorage.removeItem("profilePicture");
        setCheckingToken(false);
      }
    };

    checkTokenStatus();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await api.post("/login", formData);
  
      const token = response.data.token;
  
      // 🔐 Store the token in localStorage
      localStorage.setItem("authToken", token);
  
      // Navigate after login
      navigate("/home");
    } catch (err) {
      console.error("Login error response:", err.response);
      setError(err.response?.data?.message || "Login failed. Try again");
    }
  };
  

  if (checkingToken) {
    return (
      <div className="login-container">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="emailId" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <p>Don't have an account? <a href="/">Sign Up</a></p>
      <p className="frgtpage">Forgot Password? <a href="/forgotpassword">Click here</a></p>

    </div>
  );
};

export default Login;
