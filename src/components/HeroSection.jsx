import "../styles/Hero.css"
import { Link } from "react-router-dom"

const HeroSection = () => {
    return (
        <section className="hero">
      <div className="hero-content">
        <h2>Delight in Every Bite!</h2>
        <Link to="/products" className="explore-now-btn">
          Explore Now
        </Link>
      </div>
    </section>
      )
}

export default HeroSection
