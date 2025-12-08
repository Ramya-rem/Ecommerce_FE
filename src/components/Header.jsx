import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import { FaUser, FaBars, FaTimes } from "react-icons/fa"
import "../styles/Header.css"
import logo from "../assets/crave&conquer.logo.png"
import api from "../utils/api"

function Header({ cartItemCount, wishlistItemCount: propWishlistItemCount }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [wishlistItemCount, setWishlistItemCount] = useState(propWishlistItemCount || 0)
  // Initialize from localStorage if available to prevent initial flicker
  const [profilePicture, setProfilePicture] = useState(() => {
    try {
      const cached = localStorage.getItem("profilePicture")
      return cached || null
    } catch {
      return null
    }
  })
  const location = useLocation()
  const previousPathnameRef = useRef(location.pathname)
  const hasFetchedRef = useRef(false)  

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

  // Fetch profile picture once on mount
  useEffect(() => {
    if (hasFetchedRef.current) return
    
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile")
        if (response.data?.success && response.data.user?.profilePicture) {
          const newPicture = response.data.user.profilePicture
          setProfilePicture(newPicture)
          // Cache it in localStorage
          try {
            localStorage.setItem("profilePicture", newPicture)
          } catch (e) {
            // Ignore localStorage errors
          }
        } else {
          // Only clear if we didn't have a cached value
          setProfilePicture((prev) => {
            if (!prev) {
              try {
                localStorage.removeItem("profilePicture")
              } catch (e) {
                // Ignore localStorage errors
              }
              return null
            }
            return prev // Keep existing cached picture
          })
        }
      } catch (error) {
        // Silently fail - keep existing cached picture
      } finally {
        hasFetchedRef.current = true
      }
    }

    fetchProfile()
  }, [])

  // Only refetch when navigating away from profile page (user might have updated)
  useEffect(() => {
    const wasOnProfilePage = previousPathnameRef.current === "/profile"
    const isLeavingProfilePage = wasOnProfilePage && location.pathname !== "/profile"
    
    if (isLeavingProfilePage) {
      const fetchProfile = async () => {
        try {
          const response = await api.get("/profile")
          if (response.data?.success) {
            const newPicture = response.data.user?.profilePicture || null
            setProfilePicture((prev) => {
              // Only update if different
              if (newPicture !== prev) {
                try {
                  if (newPicture) {
                    localStorage.setItem("profilePicture", newPicture)
                  } else {
                    localStorage.removeItem("profilePicture")
                  }
                } catch (e) {
                  // Ignore localStorage errors
                }
                return newPicture
              }
              return prev // Keep existing to prevent unnecessary re-renders
            })
          }
        } catch (error) {
          // Keep existing profile picture on error to prevent flickering
        }
      }
      
      fetchProfile()
    }
    
    // Update the previous pathname ref
    previousPathnameRef.current = location.pathname
  }, [location.pathname])

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
