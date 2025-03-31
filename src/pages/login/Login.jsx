import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css"; // Import Login styles
import api from "../../utils/api";

const Login = () => {
  const [formData, setFormData] = useState({
    emailId: "",
    password: "",
  });

  const [error, setError] = useState(""); // For showing errors
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");// Clear previous errors

    try{
      const response = await api.post("/login", formData);
      console.log("Login response:", response);
      navigate("/home");
    }catch(err){
      console.error("Login error response:", err.response);
      setError(err.response?.data?.message || "Login failed. Try again");
    }  
  };

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
