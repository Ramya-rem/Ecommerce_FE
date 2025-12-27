import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaHeart, FaShoppingCart, FaTrash, FaArrowLeft } from "react-icons/fa"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import "./wishlistPage.css"
import api from "../../utils/api"

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [cartLoading, setCartLoading] = useState(false)

  // ✅ Fetch Wishlist from Backend
  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true)
      try {
        const response = await api.get("/getUserWishlist")
        if (response.data.success) {
          setWishlistItems(response.data.wishlistItems)
        }
      } catch (error) {
        console.error("Error fetching wishlist", error)
        setError("Failed to load wishlist. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchWishlist()
  }, [])

  // ✅ Fetch Cart from Backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get("/getUsercart")
        if (response.data.success) {
          setCartItems(response.data.cartItems)
        }
      } catch (error) {
        console.error("Error fetching cart", error)
      }
    }
    fetchCart()
  }, [])

  const removeFromWishlist = async (productId) => {
    setLoading(true)
    try {
      const response = await api.delete("/delete-wishlist", {
        data: { productId }
      })
      
      if (response.status === 200) {
        const productToRemove = wishlistItems.find((item) => item.id === productId)
        setWishlistItems(wishlistItems.filter((item) => item.id !== productId))
        alert(`${productToRemove.productName} removed from wishlist!`)
      }
    } catch (error) {
      console.error("Error removing from wishlist", error)
      if (error.response?.data?.message) {
        alert(error.response.data.message)
      } else {
        alert("Failed to remove item from wishlist. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (product) => {
    setCartLoading(true)
    try {
      const response = await api.post("/addtocart", {
        productId: product.id,
        quantity: 1
      })
      
      if (response.status === 200) {
        // Refresh cart data from backend
        const cartResponse = await api.get("/getUsercart")
        if (cartResponse.data.success) {
          setCartItems(cartResponse.data.cartItems)
        }
        alert(`${product.productName} added to cart!`)
      }
    } catch (error) {
      console.error("Add to cart failed:", error)
      if (error.response?.data?.message) {
        alert(error.response.data.message)
      } else {
        alert("Failed to add item to cart. Please try again.")
      }
    } finally {
      setCartLoading(false)
    }
  }

  const clearAllWishlist = async () => {
    if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
      setLoading(true)
      try {
        const response = await api.delete("/delete-wishlist?deleteAll=true")
        
        if (response.status === 200) {
          setWishlistItems([])
          alert("Wishlist cleared!")
        }
      } catch (error) {
        console.error("Error clearing wishlist", error)
        if (error.response?.data?.message) {
          alert(error.response.data.message)
        } else {
          alert("Failed to clear wishlist. Please try again.")
        }
      } finally {
        setLoading(false)
      }
    }
  }

  const addAllToCart = async () => {
    if (wishlistItems.length === 0) return

    setCartLoading(true)
    try {
      const response = await api.post("/addtocart?addAllToCart=true")
      
      if (response.status === 200) {
        // Refresh cart data from backend
        const cartResponse = await api.get("/getUsercart")
        if (cartResponse.data.success) {
          setCartItems(cartResponse.data.cartItems)
        }
        
        // Clear wishlist after moving to cart
        setWishlistItems([])
        
        const itemCount = wishlistItems.length
        alert(`${itemCount} items added to cart!`)
      }
    } catch (error) {
      console.error("Add all to cart failed:", error)
      if (error.response?.data?.message) {
        alert(error.response.data.message)
      } else {
        alert("Failed to add items to cart. Please try again.")
      }
    } finally {
      setCartLoading(false)
    }
  }

  if (loading && wishlistItems.length === 0) {
    return (
      <div className="wishlist-page">
        <Header cartItemCount={cartItems.reduce((total, item) => total + item.quantity, 0)} wishlistItemCount={wishlistItems.length} />
        <div className="wishlist-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your wishlist...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="wishlist-page">
        <Header cartItemCount={cartItems.reduce((total, item) => total + item.quantity, 0)} wishlistItemCount={wishlistItems.length} />
        <div className="wishlist-container">
          <div className="error-state">
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="wishlist-page">
      <Header cartItemCount={cartItems.reduce((total, item) => total + item.quantity, 0)} wishlistItemCount={wishlistItems.length} />

      <div className="wishlist-container">
        <div className="wishlist-header">
          <div className="header-content">
            <Link to="/home" className="back-link">
              <FaArrowLeft />
              Back to Home
            </Link>
            <h1>My Wishlist</h1>
            <p className="wishlist-count">{wishlistItems.length} items saved</p>
          </div>

          {wishlistItems.length > 0 && (
            <div className="wishlist-actions">
              <button 
                className="add-all-btn" 
                onClick={addAllToCart}
                disabled={cartLoading}
              >
                <FaShoppingCart />
                {cartLoading ? "Adding..." : "Add All to Cart"}
              </button>
              <button 
                className="clear-all-btn" 
                onClick={clearAllWishlist}
                disabled={loading}
              >
                <FaTrash />
                Clear All
              </button>
            </div>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-icon">
              <FaHeart />
            </div>
            <h2>Your wishlist is empty</h2>
            <p>Save items you love to your wishlist and shop them later!</p>
            <Link to="/home" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map((item) => (
              <div className="wishlist-item" key={item.id}>
                <div className="item-image-container">
                  <img 
                    src={`${import.meta.env.VITE_BASE_URL}${item.image}`} 
                    alt={item.productName} 
                    className="item-image" 
                  />
                  {item.badge && <span className="item-badge">{item.badge}</span>}
                  <button
                    className="remove-btn"
                    onClick={() => removeFromWishlist(item.id)}
                    disabled={loading}
                    title="Remove from wishlist"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="item-details">
                  <h3 className="item-name">{item.productName}</h3>
                  <p className="item-description">{item.description}</p>
                  <div className="item-price">${item.price.toFixed(2)}</div>
                  <div className="item-category">{item.category}</div>

                  <div className="item-actions">
                    <button 
                      className="add-to-cart-btn" 
                      onClick={() => addToCart(item)}
                      disabled={cartLoading}
                    >
                      <FaShoppingCart />
                      {cartLoading ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default WishlistPage