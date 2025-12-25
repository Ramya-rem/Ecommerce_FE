import { useState, useEffect } from "react"
import { FaStar, FaRegStar, FaUser, FaChevronRight, FaChevronLeft } from "react-icons/fa"
import "../styles/CustomerReviews.css"
import api from "../utils/api"

function CustomerReview() {
  const [feedbacks, setFeedbacks] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [failedImages, setFailedImages] = useState(new Set())
  const FEEDBACKS_PER_PAGE = 3

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true)
        const response = await api.get("/feedback/all")
        if (response.data?.success) {
          const allFeedbacks = response.data.feedbacks || []
          setFeedbacks(allFeedbacks)
        }
      } catch (error) {
        console.error("Failed to fetch feedbacks:", error)
        setFeedbacks([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeedbacks()
  }, [])

  const loadNextFeedbacks = () => {
    const nextIndex = currentIndex + FEEDBACKS_PER_PAGE
    if (nextIndex < feedbacks.length) {
      setCurrentIndex(nextIndex)
    } else {
      // If we've reached the end, loop back to the beginning
      setCurrentIndex(0)
    }
  }

  const loadPreviousFeedbacks = () => {
    const prevIndex = currentIndex - FEEDBACKS_PER_PAGE
    if (prevIndex >= 0) {
      setCurrentIndex(prevIndex)
    } else {
      // If we're at the beginning, go to the last set
      const lastSetIndex = Math.floor((feedbacks.length - 1) / FEEDBACKS_PER_PAGE) * FEEDBACKS_PER_PAGE
      setCurrentIndex(lastSetIndex)
    }
  }

  // Get only 3 feedbacks to display based on current index
  const displayedFeedbacks = feedbacks.slice(currentIndex, currentIndex + FEEDBACKS_PER_PAGE)
  const hasMoreFeedbacks = feedbacks.length > FEEDBACKS_PER_PAGE
  // Only show left arrow if user has navigated forward (not on first set)
  const hasPreviousFeedbacks = feedbacks.length > FEEDBACKS_PER_PAGE && currentIndex > 0

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="star filled" />)
      } else {
        stars.push(<FaRegStar key={i} className="star empty" />)
      }
    }
    return stars
  }

  if (loading) {
    return (
      <section className="customer-reviews">
        <div className="reviews-container">
          <h2>Customer Reviews</h2>
          <div className="reviews-grid">
            <p>Loading reviews...</p>
          </div>
        </div>
      </section>
    )
  }

  if (feedbacks.length === 0) {
    return (
      <section className="customer-reviews">
        <div className="reviews-container">
          <h2>Customer Reviews</h2>
          <div className="reviews-grid">
            <p>No reviews yet. Be the first to share your feedback!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="customer-reviews">
      <div className="reviews-container">
        <h2>Customer Reviews</h2>
        <div className="reviews-grid">
          {displayedFeedbacks.map((feedback, index) => (
            <div key={feedback._id || feedback.id} className={`review-card-wrapper ${index === 0 && hasPreviousFeedbacks ? 'has-prev-icon' : ''} ${index === 2 && hasMoreFeedbacks ? 'has-load-more' : ''}`}>
              {index === 0 && hasPreviousFeedbacks && (
                <button className="load-prev-icon" onClick={loadPreviousFeedbacks} aria-label="Load previous reviews">
                  <FaChevronLeft />
                </button>
              )}
              <div className="review-card">
                <div className="review-content">
                  <div className="reviewer-info">
                    <div className="avatar">
                      {feedback.profilePicture && !failedImages.has(feedback._id || feedback.id) ? (
                        <img 
                          src={`${import.meta.env.VITE_BASE_URL}${feedback.profilePicture}`} 
                          alt={feedback.userName || feedback.name}
                          onError={() => {
                            // Track failed image loads
                            setFailedImages(prev => new Set([...prev, feedback._id || feedback.id]))
                          }}
                        />
                      ) : (
                        <FaUser />
                      )}
                    </div>
                    <div className="reviewer-details">
                      <div className="reviewer-header">
                        <h3>{feedback.userName || feedback.name}</h3>
                        <div className="rating">{renderStars(feedback.rating)}</div>
                      </div>
                      <p className="verified-badge">Verified Customer</p>
                      <p className="review-text">{feedback.feedback || feedback.text}</p>
                    </div>
                  </div>
                </div>
              </div>
              {index === 2 && hasMoreFeedbacks && (
                <button className="load-more-icon" onClick={loadNextFeedbacks} aria-label="Load next reviews">
                  <FaChevronRight />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CustomerReview
