import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaArrowLeft, FaUser, FaCamera, FaStar, FaRegStar, FaTrash } from "react-icons/fa"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import api from "../../utils/api"
import "./ProfilePage.css"

const ProfilePage = () => {
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    emailId: "",
  })
  const [profilePicture, setProfilePicture] = useState(null)
  const [profilePictureFile, setProfilePictureFile] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [uploadingPicture, setUploadingPicture] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [feedbackData, setFeedbackData] = useState({
    rating: 0,
    feedback: "",
  })
  const [userFeedbacks, setUserFeedbacks] = useState([])
  const [submittingFeedback, setSubmittingFeedback] = useState(false)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [deletingFeedbackId, setDeletingFeedbackId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchHeaderCounts = async () => {
      try {
        const [cartRes, wishlistRes] = await Promise.all([
          api.get("/getUsercart").catch(() => ({ data: { success: false, cartItems: [] } })),
          api.get("/getUserWishlist").catch(() => ({ data: { success: false, wishlistItems: [] } }))
        ])

        if (cartRes?.data?.success) {
          const count = cartRes.data.cartItems.reduce((total, item) => total + (item.quantity || 1), 0)
          setCartCount(count)
        }
        if (wishlistRes?.data?.success) {
          setWishlistCount((wishlistRes.data.wishlistItems || []).length)
        }
      } catch (_) {
        // Best-effort; ignore header count failures
      }
    }

    fetchHeaderCounts()
  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile")
        if (response.data?.success) {
          const userData = response.data.user
          setUser(userData)
          setFormData({
            name: userData.name || "",
            emailId: userData.emailId || "",
          })
          setProfilePicture(userData.profilePicture)
        }
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login")
        } else {
          setMessage({ type: "error", text: "Failed to load profile. Please try again." })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
    fetchUserFeedbacks()
  }, [navigate])

  const fetchUserFeedbacks = async () => {
    try {
      const response = await api.get("/feedback/my-feedbacks")
      if (response.data?.success) {
        setUserFeedbacks(response.data.feedbacks || [])
      }
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error)
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "Image size should be less than 5MB" })
        return
      }
      setProfilePictureFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicture(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setUpdating(true)
    setMessage({ type: "", text: "" })

    try {
      const response = await api.put("/profile", formData)
      if (response.data?.success) {
        setUser(response.data.user)
        setMessage({ type: "success", text: "Profile updated successfully!" })
        setTimeout(() => setMessage({ type: "", text: "" }), 3000)
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile. Please try again.",
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleUpdateProfilePicture = async () => {
    if (!profilePictureFile) {
      setMessage({ type: "error", text: "Please select an image first" })
      return
    }

    setUploadingPicture(true)
    setMessage({ type: "", text: "" })

    try {
      const formData = new FormData()
      formData.append("profilePicture", profilePictureFile)

      const response = await api.put("/profile/picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data?.success) {
        setProfilePicture(response.data.profilePicture)
        setProfilePictureFile(null)
        setMessage({ type: "success", text: "Profile picture updated successfully!" })
        setTimeout(() => setMessage({ type: "", text: "" }), 3000)
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile picture. Please try again.",
      })
    } finally {
      setUploadingPicture(false)
    }
  }

  const getProfilePictureUrl = () => {
    if (profilePicture) {
      if (profilePicture.startsWith("data:")) {
        return profilePicture
      }
      if (profilePicture.startsWith("/uploads/")) {
        return `${import.meta.env.VITE_BASE_URL}${profilePicture}`
      }
      return profilePicture
    }
    return null
  }

  const handleRatingClick = (rating) => {
    setFeedbackData({ ...feedbackData, rating })
  }

  const handleFeedbackChange = (e) => {
    const value = e.target.value
    setFeedbackData({ ...feedbackData, feedback: value })
  }

  const getWordCount = (text) => {
    if (!text || !text.trim()) return 0
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  const wordCount = getWordCount(feedbackData.feedback)
  const isWordLimitExceeded = wordCount > 200

  const handleSubmitFeedback = async (e) => {
    e.preventDefault()

    // Check if rating is selected
    if (!feedbackData.rating || feedbackData.rating === 0) {
      setMessage({
        type: "error",
        text: "Please select a rating before submitting.",
      })
      return
    }

    setSubmittingFeedback(true)
    setMessage({ type: "", text: "" })

    try {
      const response = await api.post("/feedback", feedbackData)
      if (response.data?.success) {
        setMessage({ type: "success", text: response.data.message })
        setFeedbackData({ rating: 0, feedback: "" })
        setShowFeedbackForm(false)
        await fetchUserFeedbacks()
        setTimeout(() => setMessage({ type: "", text: "" }), 3000)
      }
    } catch (error) {        
      if (error.response) {
        // Axios error with response
        errorMessage = error.response.data?.message || error.response.data?.error || error.response.statusText || errorMessage
      } else {
        // Error in setting up the request
        errorMessage = error.message
      }      
      setMessage({
        type: "error",
        text: errorMessage,
      })
    } finally {
      setSubmittingFeedback(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
  }

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm("Are you sure you want to delete this feedback? This action cannot be undone.")) {
      return
    }

    setDeletingFeedbackId(feedbackId)
    setMessage({ type: "", text: "" })

    try {
      const response = await api.delete(`/feedback/${feedbackId}`)
      if (response.data?.success) {
        setMessage({ type: "success", text: "Feedback deleted successfully!" })
        await fetchUserFeedbacks()
        setTimeout(() => setMessage({ type: "", text: "" }), 3000)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete feedback. Please try again."
      setMessage({
        type: "error",
        text: errorMessage,
      })
    } finally {
      setDeletingFeedbackId(null)
    }
  }

  if (loading) {
    return (
      <div className="profile-page">
        <Header cartItemCount={cartCount} wishlistItemCount={wishlistCount} />
        <div className="profile-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="profile-page">
      <Header cartItemCount={cartCount} wishlistItemCount={wishlistCount} />

      <div className="profile-container">
        <div className="profile-header">
          <Link to="/home" className="back-link">
            <FaArrowLeft />
            Back to Home
          </Link>
          <h1>My Profile</h1>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="profile-content">
          <div className="profile-picture-section">
            <div className="profile-picture-wrapper">
              {getProfilePictureUrl() ? (
                <img
                  src={getProfilePictureUrl()}
                  alt="Profile"
                  className="profile-picture"
                />
              ) : (
                <div className="profile-picture-placeholder">
                  <FaUser size={60} />
                </div>
              )}
              <label htmlFor="profile-picture-input" className="camera-icon">
                <FaCamera />
              </label>
              <input
                type="file"
                id="profile-picture-input"
                accept="image/*"
                onChange={handleProfilePictureChange}
                style={{ display: "none" }}
              />
            </div>
            {profilePictureFile && (
              <button
                className="update-picture-btn"
                onClick={handleUpdateProfilePicture}
                disabled={uploadingPicture}
              >
                {uploadingPicture ? "Uploading..." : "Update Picture"}
              </button>
            )}
          </div>

          <div className="profile-form-section">
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="emailId">Email Address</label>
                <input
                  type="email"
                  id="emailId"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="update-btn"
                disabled={updating}
              >
                {updating ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="feedback-section">
          <div className="feedback-header">
            <h2>Share Your Feedback</h2>
            <button
              className="toggle-feedback-btn"
              onClick={() => setShowFeedbackForm(!showFeedbackForm)}
            >
              {showFeedbackForm ? "Cancel" : "Add Feedback"}
            </button>
          </div>

          {showFeedbackForm && (
            <form onSubmit={handleSubmitFeedback} className="feedback-form">
              <div className="form-group">
                <label>Rating</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    feedbackData.rating >= star ? (
                      <FaStar
                        key={star}
                        className="star filled"
                        onClick={() => handleRatingClick(star)}
                      />
                    ) : (
                      <FaRegStar
                        key={star}
                        className="star empty"
                        onClick={() => handleRatingClick(star)}
                      />
                    )
                  ))}
                  {feedbackData.rating > 0 && (
                    <span className="rating-text">{feedbackData.rating} out of 5</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="feedback">Your Feedback</label>
                <textarea
                  id="feedback"
                  name="feedback"
                  value={feedbackData.feedback}
                  onChange={handleFeedbackChange}
                  placeholder="Share your thoughts about our service..."
                  rows="5"
                  required
                  className={isWordLimitExceeded ? "error" : ""}
                />
                <div className={`word-count ${isWordLimitExceeded ? "error" : ""}`}>
                  {wordCount} / 200 words {isWordLimitExceeded && "(Limit exceeded)"}
                </div>
              </div>

              {message.text && message.type === "error" && (
                <div className="feedback-form-error" style={{ 
                  color: "#721c24", 
                  backgroundColor: "#f8d7da", 
                  border: "1px solid #f5c6cb",
                  padding: "0.75rem", 
                  borderRadius: "4px", 
                  marginBottom: "1rem",
                  fontSize: "0.875rem"
                }}>
                  {message.text}
                </div>
              )}

              {message.text && message.type === "success" && (
                <div className="feedback-form-success" style={{ 
                  color: "#155724", 
                  backgroundColor: "#d4edda", 
                  border: "1px solid #c3e6cb",
                  padding: "0.75rem", 
                  borderRadius: "4px", 
                  marginBottom: "1rem",
                  fontSize: "0.875rem"
                }}>
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                className="submit-feedback-btn"
                disabled={submittingFeedback}
              >
                {submittingFeedback ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          )}

          {userFeedbacks.length > 0 && (
            <div className="my-feedbacks-section">
              <h3>My Feedbacks</h3>
              <div className="feedbacks-list">
                {userFeedbacks.map((feedback) => (
                  <div key={feedback._id} className="feedback-card">
                    <div className="feedback-header-card">
                      <div className="feedback-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          feedback.rating >= star ? (
                            <FaStar
                              key={star}
                              className="star filled"
                            />
                          ) : (
                            <FaRegStar
                              key={star}
                              className="star empty"
                            />
                          )
                        ))}
                      </div>
                      <div className="feedback-card-actions">
                        <span className="feedback-date">{formatDate(feedback.createdAt)}</span>
                        <button
                          className="delete-feedback-btn"
                          onClick={() => handleDeleteFeedback(feedback._id)}
                          disabled={deletingFeedbackId === feedback._id}
                          aria-label="Delete feedback"
                        >
                          {deletingFeedbackId === feedback._id ? (
                            "Deleting..."
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="feedback-text">{feedback.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ProfilePage

