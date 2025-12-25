"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaArrowLeft, FaPlus, FaMinus, FaTrash, FaShoppingCart } from "react-icons/fa"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import "./CartPage.css"
import api from "../../utils/api"

const CartPage = () => {
  const navigate = useNavigate()
  const [wishlistItemCount, setWishlistItemCount] = useState(0)
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    tax: 0,
    taxPercentage: 0,
    shipping: "FREE",
    total: 0
  })

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
      }
    }

    fetchWishlistCount()
  }, [])

  // Fetch cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true)
      try {
        const response = await api.get("/getUsercart")
        if (response.data.success) {
          setCartItems(response.data.cartItems)
        }
      } catch (error) {
        console.error("Error fetching cart", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [])

  // Fetch order summary from backend
  const fetchOrderSummary = async () => {
    try {
      const response = await api.get("/fetchOrderSummary")
      if (response.status === 200) {
        setOrderSummary({
          subtotal: Number(response.data.subtotal) || 0,
          tax: Number(response.data.tax) || 0,
          taxPercentage: Number(response.data.taxPercentage) || 0,
          shipping: response.data.shipping || "FREE",
          total: Number(response.data.total) || 0
        })
      }
    } catch (error) {
      console.error("Error fetching order summary:", error)
      // Reset to default values if API fails
      setOrderSummary({
        subtotal: 0,
        tax: 0,
        taxPercentage: 0,
        shipping: "FREE",
        total: 0
      })
    }
  }

  // Fetch order summary when cart items change
  useEffect(() => {
    if (cartItems.length > 0) {
      fetchOrderSummary()
    } else {
      setOrderSummary({
        subtotal: 0,
        tax: 0,
        taxPercentage: 0,
        shipping: "FREE",
        total: 0
      })
    }
  }, [cartItems])

  const updateQuantity = async (productId, action) => {
    try {
      const response = await api.post("/update-cartQuantity", {
        productId,
        action
      })
      
      if (response.status === 200) {
        // Refresh cart data from backend
        const cartResponse = await api.get("/getUsercart")
        if (cartResponse.data.success) {
          setCartItems(cartResponse.data.cartItems)
        }
      }
    } catch (error) {
      console.error("Update quantity failed:", error)
      if (error.response?.data?.message) {
        alert(error.response.data.message)
      } else {
        alert("Failed to update quantity. Please try again.")
      }
    }
  }

  const removeFromCart = async (productId) => {
    try {
      const response = await api.delete("/deletecart", {
        data: { productId }
      })
      
      if (response.status === 200) {
        // Refresh cart data from backend
        const cartResponse = await api.get("/getUsercart")
        if (cartResponse.data.success) {
          setCartItems(cartResponse.data.cartItems)
        }
        
        const productToRemove = cartItems.find((item) => item.id === productId)
        alert(`${productToRemove.productName} removed from cart!`)
      }
    } catch (error) {
      console.error("Remove from cart failed:", error)
      if (error.response?.data?.message) {
        alert(error.response.data.message)
      } else {
        alert("Failed to remove item from cart. Please try again.")
      }
    }
  }

  const clearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      try {
        const response = await api.delete("/deletecart?clearcart=true")
        
        if (response.status === 200) {
          setCartItems([])
          alert("Cart cleared!")
        }
      } catch (error) {
        console.error("Clear cart failed:", error)
        if (error.response?.data?.message) {
          alert(error.response.data.message)
        } else {
          alert("Failed to clear cart. Please try again.")
        }
      }
    }
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const handleOrderNow = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!")
      return
    }

    // Navigate to checkout page
    navigate("/checkout")
  }

  if (loading) {
    return (
      <div className="cart-page">
        <Header cartItemCount={0} wishlistItemCount={wishlistItemCount} />
        <div className="cart-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your cart...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="cart-page">
      <Header cartItemCount={getTotalItems()} wishlistItemCount={wishlistItemCount} />

      <div className="cart-container">
        <div className="cart-header">
          <div className="header-content">
            <Link to="/home" className="back-link">
              <FaArrowLeft />
              Back to Home
            </Link>
            <h1>Shopping Cart</h1>
            <p className="cart-count">{getTotalItems()} items in cart</p>
          </div>

          {cartItems.length > 0 && (
            <div className="cart-actions">
              <button className="clear-cart-btn" onClick={clearCart}>
                <FaTrash />
                Clear Cart
              </button>
            </div>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">
              <FaShoppingCart />
            </div>
            <h2>Your cart is empty</h2>
            <p>Add some delicious desserts to your cart and enjoy!</p>
            <Link to="/products" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="item-image-container">
                    <img src={`http://localhost:7777${item.image}`} alt={item.productName} className="item-image" />
                    {item.badge && <span className="item-badge">{item.badge}</span>}
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)} title="Remove from cart">
                      <FaTrash />
                    </button>
                  </div>

                  <div className="item-details">
                    <div className="item-info">
                      <h3 className="item-name">{item.productName}</h3>
                      <p className="item-description">{item.description}</p>
                      <div className="item-price">${item.price.toFixed(2)} each</div>
                    </div>

                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, "decrease")}
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus />
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button className="quantity-btn" onClick={() => updateQuantity(item.id, "increase")}>
                          <FaPlus />
                        </button>
                      </div>

                      <div className="item-total">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-card">
                <h3>Order Summary</h3>

                <div className="summary-row">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>${orderSummary.subtotal.toFixed(2)}</span>
                </div>

                <div className="summary-row">
                  <span>Tax {orderSummary.taxPercentage > 0 ? `(${orderSummary.taxPercentage.toFixed(1)}%)` : ''}</span>
                  <span>${orderSummary.tax.toFixed(2)}</span>
                </div>

                <div className="summary-row shipping">
                  <span>Shipping</span>
                  <span className="free">{orderSummary.shipping}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total">
                  <span>Total</span>
                  <span>${orderSummary.total.toFixed(2)}</span>
                </div>

                <button className="order-now-btn" onClick={handleOrderNow}>
                  Order Now
                </button>

                <Link to="/products" className="continue-shopping-link">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default CartPage
