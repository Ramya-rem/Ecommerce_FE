import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { FaCheckCircle, FaBox, FaMapMarkerAlt, FaReceipt } from "react-icons/fa"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import "./OrderConfirmationPage.css"
import api from "../../utils/api"

const OrderConfirmationPage = () => {
  const location = useLocation()
  const [wishlistItemCount, setWishlistItemCount] = useState(0)
  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(true)


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

  // Get order details from location state or localStorage
  useEffect(() => {
    const getOrderDetails = () => {
      try {
        // Try to get from location state first (from checkout page)
        if (location.state && location.state.orderId) {
          const orderData = {
            orderId: location.state.orderId,
            totalAmount: location.state.totalAmount,
            orderDate: new Date().toLocaleDateString(),
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            paymentMethod: localStorage.getItem("paymentData") ? "UPI" : "Cash on Delivery",
            items: JSON.parse(localStorage.getItem("cartItems") || "[]"),
            address: JSON.parse(localStorage.getItem("selectedAddress") || "{}"),
            subtotal: location.state.totalAmount / 1.08, // Remove tax to get subtotal
            tax: (location.state.totalAmount / 1.08) * 0.08,
            total: location.state.totalAmount,
            discount: 0
          }
          setOrderDetails(orderData)
        } else {
          // Fallback: redirect to home if no order data
          window.location.href = "/home"
        }
      } catch (error) {
        console.error("Error getting order details:", error)
        window.location.href = "/home"
      } finally {
        setLoading(false)
      }
    }

    getOrderDetails()
  }, [location.state])

  if (loading) {
    return (
      <div className="confirmation-page">
        <Header cartItemCount={0} wishlistItemCount={wishlistItemCount} />
        <div className="confirmation-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your order details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="confirmation-page">
        <Header cartItemCount={0} wishlistItemCount={wishlistItemCount} />
        <div className="confirmation-container">
          <div className="error-state">
            <h2>Order not found</h2>
            <p>Unable to retrieve order details. Please contact support.</p>
            <Link to="/home" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="confirmation-page">
      <Header cartItemCount={0} wishlistItemCount={wishlistItemCount} />

      <div className="confirmation-container">
        <div className="confirmation-header">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          <h1>Order Confirmed!</h1>
          <p className="success-message">
            Thank you for your order. Your order has been received and is being processed.
          </p>
        </div>

        <div className="order-info">
          <div className="order-info-item">
            <span className="info-label">Order Number:</span>
            <span className="info-value">{orderDetails.orderId}</span>
          </div>
          <div className="order-info-item">
            <span className="info-label">Order Date:</span>
            <span className="info-value">{orderDetails.orderDate}</span>
          </div>
          <div className="order-info-item">
            <span className="info-label">Estimated Delivery:</span>
            <span className="info-value">{orderDetails.estimatedDelivery}</span>
          </div>
          <div className="order-info-item">
            <span className="info-label">Payment Method:</span>
            <span className="info-value">{orderDetails.paymentMethod}</span>
          </div>
        </div>

        <div className="confirmation-content">
          <div className="confirmation-main">
            {/* Order Items */}
            <section className="confirmation-section">
              <div className="section-header">
                <h2>
                  <FaBox className="section-icon" />
                  Order Items
                </h2>
              </div>

              <div className="order-items">
                {orderDetails.items.map((item) => (
                  <div className="order-item" key={item.id}>
                    <div className="item-image-container">
                      <img src={item.image ? `${import.meta.env.VITE_BASE_URL}${item.image}` : "/placeholder.svg"} alt={item.productName || item.name} className="item-image" />
                    </div>
                    <div className="item-details">
                      <h3 className="item-name">{item.productName || item.name}</h3>
                      <div className="item-price-qty">
                        <span className="item-price">${item.price.toFixed(2)} each</span>
                        <span className="item-quantity">Qty: {item.quantity}</span>
                      </div>
                      <div className="item-total">Total: ${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Delivery Address */}
            <section className="confirmation-section">
              <div className="section-header">
                <h2>
                  <FaMapMarkerAlt className="section-icon" />
                  Delivery Address
                </h2>
              </div>

              <div className="delivery-address">
                <div className="address-name">{orderDetails.address.name}</div>
                <div className="address-phone">{orderDetails.address.phone}</div>
                <div className="address-details">
                  {orderDetails.address.address}, {orderDetails.address.city}, {orderDetails.address.state}{" "}
                  {orderDetails.address.zipCode}
                </div>
              </div>
            </section>
          </div>

          <div className="confirmation-sidebar">
            {/* Order Summary */}
            <section className="confirmation-section">
              <div className="section-header">
                <h2>
                  <FaReceipt className="section-icon" />
                  Order Summary
                </h2>
              </div>

              <div className="order-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${orderDetails.subtotal.toFixed(2)}</span>
                </div>

                <div className="summary-row">
                  <span>Tax (8%)</span>
                  <span>${orderDetails.tax.toFixed(2)}</span>
                </div>

                {orderDetails.discount > 0 && (
                  <div className="summary-row discount">
                    <span>Discount</span>
                    <span>-${orderDetails.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="summary-row shipping">
                  <span>Shipping</span>
                  <span className="free">FREE</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total">
                  <span>Total</span>
                  <span>${orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </section>

            <div className="action-buttons">
              <Link to="/home" className="continue-shopping-btn">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default OrderConfirmationPage
