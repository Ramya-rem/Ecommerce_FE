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

  // Sample cart data - in real app, this would come from props or context
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "🍓 Strawberry Cake",
      description: "Fresh strawberries with cream cheese frosting",
      price: 24.99,
      quantity: 2,
      image: "https://placehold.co/600x400",
      badge: "Popular",
    },
    {
      id: 2,
      name: "🍫 Choco Lava",
      description: "Warm chocolate cake with molten center",
      price: 19.99,
      quantity: 1,
      image: "https://placehold.co/600x400",
    },
    {
      id: 3,
      name: "🥥 Coconut Cake",
      description: "Light coconut cake with coconut flakes",
      price: 22.99,
      quantity: 3,
      image: "https://placehold.co/600x400",
      badge: "New",
    },
  ])

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))
  }

  const removeFromCart = (productId) => {
    const productToRemove = cartItems.find((item) => item.id === productId)
    setCartItems(cartItems.filter((item) => item.id !== productId))
    alert(`${productToRemove.name} removed from cart!`)
  }

  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      setCartItems([])
      alert("Cart cleared!")
    }
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.08 // 8% tax
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
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
            <Link to="/home" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="item-image-container">
                    <img src={item.image || "/placeholder.svg"} alt={item.name} className="item-image" />
                    {item.badge && <span className="item-badge">{item.badge}</span>}
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)} title="Remove from cart">
                      <FaTrash />
                    </button>
                  </div>

                  <div className="item-details">
                    <div className="item-info">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-description">{item.description}</p>
                      <div className="item-price">${item.price.toFixed(2)} each</div>
                    </div>

                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus />
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
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
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>

                <div className="summary-row">
                  <span>Tax (8%)</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>

                <div className="summary-row shipping">
                  <span>Shipping</span>
                  <span className="free">FREE</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>

                <button className="order-now-btn" onClick={handleOrderNow}>
                  Order Now
                </button>

                <Link to="/home" className="continue-shopping-link">
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
