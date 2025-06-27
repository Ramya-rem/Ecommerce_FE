import { useState } from "react"
import { Link } from "react-router-dom"
import logo from "../../assets/crave&conquer.logo.png"
import "./ForgotPassword.css"
import api from '../../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    setEmail(e.target.value)
    setError("")
  }

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      setError("Email is required")
      return false
    } else if (!emailRegex.test(email)) {
      setError("Please enter a valid email")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsLoading(true)

      try {
      const response = await api.post(
        `/forgotPassword`,
        { emailId: email }
      );

      if (response.status === 200) {
        setIsSubmitted(true);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Server error. Please try again.");
      }
    }finally {
      setIsLoading(false);
    }
  }
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form-container">
        <div className="forgot-password-header">
          <img src={logo || "/placeholder.svg"} alt="Crave & Conquer Logo" className="forgot-password-logo" />
          <h1>Forgot Password</h1>
          <p>Enter your email to reset your password</p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={error ? "error" : ""}
              />
              {error && <div className="error-message">{error}</div>}
            </div>

            <button type="submit" className="reset-button" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Check Your Email</h2>
            <p>
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="small-text">If you don't see the email, check your spam folder.</p>
          </div>
        )}

        <div className="forgot-password-footer">
          <p>
            Remember your password?{" "}
            <Link to="/login" className="login-link">
              Log In
            </Link>
          </p>
        </div>
      </div>

      <div className="forgot-password-image">
        <div className="image-overlay">
          <h2>Reset Your Password</h2>
          <p>
            Don't worry! It happens to the best of us. Enter your email and we'll send you a link to reset your
            password.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
