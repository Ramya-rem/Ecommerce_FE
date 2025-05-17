import { FaStar, FaRegStar, FaUser } from "react-icons/fa"
import "../styles/CustomerReviews.css"

function CustomerReview() {
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      verified: true,
      text: "The strawberry cake was absolutely divine! The frosting was perfectly sweet and the cake was so moist. Will definitely order again for special occasions!",
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 4,
      verified: true,
      text: "The chocolate lava cake was incredible! The center was perfectly gooey and the cake had a rich chocolate flavor. Would recommend to any chocolate lover!",
    },
    {
        id: 3,
        name: "Angel",
        rating: 3,
        verified: true,
        text: "The chocolate lava cake was incredible! The center was perfectly gooey and the cake had a rich chocolate flavor. Would recommend to any chocolate lover!",
    },
  ]

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

  return (
    <section className="customer-reviews">
      <div className="reviews-container">
        <h2>Customer Reviews</h2>
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div className="review-card" key={review.id}>
              <div className="review-content">
                <div className="reviewer-info">
                  <div className="avatar">
                    <FaUser />
                  </div>
                  <div className="reviewer-details">
                    <div className="reviewer-header">
                      <h3>{review.name}</h3>
                      <div className="rating">{renderStars(review.rating)}</div>
                    </div>
                    {review.verified && <p className="verified-badge">Verified Purchase</p>}
                    <p className="review-text">{review.text}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CustomerReview
