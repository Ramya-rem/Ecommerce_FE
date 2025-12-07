import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { FaUser, FaBars, FaTimes } from "react-icons/fa"
import "../styles/Header.css"
import logo from "../assets/crave&conquer.logo.png"
import api from "../utils/api"

function Header({ cartItemCount, wishlistItemCount: propWishlistItemCount }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [wishlistItemCount, setWishlistItemCount] = useState(propWishlistItemCount || 0)
  const [profilePicture, setProfilePicture] = useState(null)
  const location = useLocation()  

  // Fetch wishlist count from backend
  useEffect(() => {
    const fetchWishlistCount = async () => {
      try {
        const response = await api.get("/getUserWishlist")
        if (response.data.success) {
          setWishlistItemCount(response.data.wishlistCount || 0)
        }
      } catch (error) {
        console.error("Error fetching wishlist count:", error)
        // Keep the prop value if API call fails
        setWishlistItemCount(propWishlistItemCount || 0)
      }
    }

    fetchWishlistCount()
  }, [propWishlistItemCount])

  // Fetch profile picture from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile")
        if (response.data?.success && response.data.user?.profilePicture) {
          setProfilePicture(response.data.user.profilePicture)
        } else {
          setProfilePicture(null)
        }
      } catch (error) {
        // Silently fail if profile fetch fails (user might not be logged in)
        setProfilePicture(null)
      }
    }

    fetchProfile()
  }, [location.pathname]) // Refetch when navigating (especially useful after profile updates)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }
  const isActive = (path) => location.pathname === path ? "active-link" : ""

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
                {getProfilePictureUrl() ? (
                  <img 
                    src={getProfilePictureUrl()} 
                    alt="Profile" 
                    className="profile-icon-image"
                  />
                ) : (
                  <FaUser />
                )}
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
