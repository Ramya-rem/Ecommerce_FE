import { useState } from "react"
import logo from "../assets/crave&conquer.logo.png"
import { FaUser, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa"
import "../styles/Header.css"

function Header({ cartItemCount }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <img src={logo || "/placeholder.svg"} alt="Crave & Conquer Logo" className="logo" />
        </div>

        <nav className={`nav-menu ${mobileMenuOpen ? "active" : ""}`}>
          <ul>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Shop</a>
            </li>
            <li>
              <a href="#">Wishlist</a>
            </li>
            <li>
              <a href="#">Cart</a>
            </li>
            <li>
              <a href="#">Orders</a>
            </li>
            <li className="icon-link">
              <a href="#">
                <FaUser />
              </a>
            </li>
          </ul>
          <button className="close-menu" onClick={toggleMobileMenu}>
            <FaTimes />
          </button>
        </nav>

        <div className="header-icons">
          <div className="cart-icon">
            <FaShoppingCart />
            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
          </div>
          <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            <FaBars />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
