import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { FaUser, FaBars, FaTimes } from "react-icons/fa"
import "../styles/Header.css"
import logo from "../assets/crave&conquer.logo.png"

function Header({ cartItemCount, wishlistItemCount }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()  

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }
  const isActive = (path) => location.pathname === path ? "active-link" : ""

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo on the left */}
        <div className="logo-container">
          <Link to="/home">
            <img src={logo || "/placeholder.svg"} alt="Crave & Conquer Logo" className="logo" />
          </Link>
        </div>

        {/* Navigation on the right */}
        <nav className={`nav-menu ${mobileMenuOpen ? "active" : ""}`}>
          <ul>
            <li>
              <Link to="/home" className={isActive("/home")}>Home</Link>
            </li>
            <li>
              <Link to="/products" className={isActive("/products")}>Shop</Link>
            </li>
            <li>
               <Link to="/wishlist" className={isActive("/wishlist")}>
                Wishlist
                {wishlistItemCount > 0 && <span className="nav-badge">{wishlistItemCount}</span>}
              </Link>
            </li>
            <li>
               <Link to="/cart" className={isActive("/cart")}>
                Cart
                {cartItemCount > 0 && <span className="nav-badge">{cartItemCount}</span>}
              </Link>
            </li>
            <li>
              <Link to="/orders" className={isActive("/orders")}>Orders</Link>
            </li>
            <li className="icon-link">
              <Link to="/profile" className={isActive("/profile")}>
                <FaUser />
              </Link>
            </li>
          </ul>
          <button className="close-menu" onClick={toggleMobileMenu}>
            <FaTimes />
          </button>
        </nav>

        {/* Mobile menu button */}
        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          <FaBars />
        </button>
      </div>
    </header>
  )
}

export default Header
