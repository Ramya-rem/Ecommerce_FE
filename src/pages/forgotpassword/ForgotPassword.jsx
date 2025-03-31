import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./forgotPassword.css"; 
import api from "../../utils/api"; 

const ForgotPassword = () => {
  const [emailId, setEmailId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/forgotPassword", { emailId });
      

      alert(response.data.message); // Use backend response message
      navigate("/login"); 

    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong! Please try again.");
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <p>Enter your email address to reset your password</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="emailId"
          placeholder="Enter your email"
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      <p><a href="/login">Back to Login</a></p>
    </div>
  );
};

export default ForgotPassword;
