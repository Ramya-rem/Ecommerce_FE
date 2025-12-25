import { useNavigate } from "react-router-dom"
import "../styles/Offer.css"

function Offer() {
  const navigate = useNavigate()

  const handleClaimOffer = () => {
    navigate("/products")
  }

  return (
    <section className="special-offers">
      <div className="offers-container">
        <h2>Special Offers</h2>
        <p>20% OFF on first order!</p>
        <button className="claim-offer-btn" onClick={handleClaimOffer}>
          Claim Offer
        </button>
      </div>
    </section>
  )
}

export default Offer
