import { useState } from "react"
import { Link } from "react-router-dom"
import { FaUser, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa"
import logo from "../assets/crave&conquer.logo.png"
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
            <Link to="/home">
              <img src={logo || "/placeholder.svg"} alt="Crave & Conquer Logo" className="logo" />
            </Link>
          </div>
  
          <nav className={`nav-menu ${mobileMenuOpen ? "active" : ""}`}>
            <ul>
              <li>
                <Link to="/home">Home</Link>
              </li>
              <li>
                <Link to="/shop">Shop</Link>
              </li>
              <li>
                <Link to="/wishlist">Wishlist</Link>
              </li>
              <li>
                <Link to="/cart">Cart</Link>
              </li>
              <li>
                <Link to="/orders">Orders</Link>
              </li>
              <li className="icon-link">
                <Link to="/profile">
                  <FaUser />
                </Link>
              </li>
            </ul>
            <button className="close-menu" onClick={toggleMobileMenu}>
              <FaTimes />
            </button>
          </nav>
  
          <div className="header-icons">
            <Link to="/cart" className="cart-icon">
              <FaShoppingCart />
              {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
            </Link>
            <button className="mobile-menu-button" onClick={toggleMobileMenu}>
              <FaBars />
            </button>
          </div>
        </div>
      </header>
    )
}

export default Header
