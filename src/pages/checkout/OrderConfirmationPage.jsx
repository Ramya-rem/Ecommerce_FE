import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { FaCheckCircle, FaBox, FaMapMarkerAlt, FaReceipt } from "react-icons/fa"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import "./OrderConfirmationPage.css"
import api from "../../utils/api"
import { useOrders } from "../../context/OrderContext"

const OrderConfirmationPage = () => {
  const location = useLocation()
  const { getOrderById } = useOrders()
  const [wishlistItemCount, setWishlistItemCount] = useState(0)
  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [taxPercentage, setTaxPercentage] = useState(0)


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

  // Get order details from location state, OrderContext, or localStorage
  useEffect(() => {
    const getOrderDetails = () => {
      try {
        // Try to get from location state first (from checkout page)
        if (location.state && location.state.orderId) {
          // First try to get from OrderContext
          const contextOrder = getOrderById(location.state.orderId)
          
          if (contextOrder) {
            // Use order from context
            // Calculate tax percentage if tax and subtotal are available
            const subtotal = contextOrder.subtotal || 0
            const tax = contextOrder.tax || 0
            const calculatedTaxPercentage = subtotal > 0 ? (tax / subtotal) * 100 : 0
            setTaxPercentage(calculatedTaxPercentage)
            
            setOrderDetails({
              orderId: contextOrder.id,
              totalAmount: contextOrder.total,
              orderDate: new Date(contextOrder.orderDate).toLocaleDateString(),
              estimatedDelivery: contextOrder.estimatedDelivery 
                ? new Date(contextOrder.estimatedDelivery).toLocaleDateString()
                : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
              paymentMethod: contextOrder.paymentMethod || (localStorage.getItem("paymentData") ? "Card" : "Cash on Delivery"),
              items: contextOrder.items || [],
              address: contextOrder.deliveryAddress || {},
              subtotal: subtotal,
              tax: tax,
              total: contextOrder.total || location.state.totalAmount || 0,
              discount: contextOrder.discount || 0
            })
          } else if (location.state.orderData) {
            // Use orderData from location.state
            const orderData = location.state.orderData
            const subtotal = orderData.subtotal || 0
            const tax = orderData.tax || 0
            const calculatedTaxPercentage = subtotal > 0 ? (tax / subtotal) * 100 : 0
            setTaxPercentage(calculatedTaxPercentage)
            
            setOrderDetails({
              orderId: location.state.orderId,
              totalAmount: location.state.totalAmount || orderData.total || 0,
              orderDate: new Date().toLocaleDateString(),
              estimatedDelivery: orderData.estimatedDelivery 
                ? new Date(orderData.estimatedDelivery).toLocaleDateString()
                : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
              paymentMethod: orderData.paymentMethod || (localStorage.getItem("paymentData") ? "Card" : "Cash on Delivery"),
              items: orderData.items || [],
              address: orderData.deliveryAddress || {},
              subtotal: subtotal,
              tax: tax,
              total: orderData.total || location.state.totalAmount || 0,
              discount: orderData.discount || 0
            })
          } else {
            // Fallback: use location.state values
            const totalAmount = location.state.totalAmount || 0
            // For fallback, we don't have tax data, so set to 0
            setTaxPercentage(0)
            setOrderDetails({
              orderId: location.state.orderId,
              totalAmount: totalAmount,
              orderDate: new Date().toLocaleDateString(),
              estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
              paymentMethod: localStorage.getItem("paymentData") ? "Card" : "Cash on Delivery",
              items: JSON.parse(localStorage.getItem("cartItems") || "[]"),
              address: JSON.parse(localStorage.getItem("selectedAddress") || "{}"),
              subtotal: 0,
              tax: 0,
              total: totalAmount,
              discount: 0
            })
          }
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
  }, [location.state, getOrderById])

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
                {(orderDetails.items || []).map((item, index) => (
                  <div className="order-item" key={item.id || item._id || index}>
                    <div className="item-image-container">
                      <img src={item.image ? `${import.meta.env.VITE_BASE_URL}${item.image}` : "/placeholder.svg"} alt={item.productName || item.name} className="item-image" />
                    </div>
                    <div className="item-details">
                      <h3 className="item-name">{item.productName || item.name}</h3>
                      <div className="item-price-qty">
                        <span className="item-price">${((item.price || 0)).toFixed(2)} each</span>
                        <span className="item-quantity">Qty: {item.quantity || 1}</span>
                      </div>
                      <div className="item-total">Total: ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</div>
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
                <div className="address-name">{orderDetails.address?.name || "N/A"}</div>
                <div className="address-phone">{orderDetails.address?.phone || "N/A"}</div>
                <div className="address-details">
                  {orderDetails.address?.address || ""}, {orderDetails.address?.city || ""}, {orderDetails.address?.state || ""}{" "}
                  {orderDetails.address?.zipCode || ""}
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
                  <span>${(orderDetails.subtotal || 0).toFixed(2)}</span>
                </div>

                <div className="summary-row">
                  <span>Tax {taxPercentage > 0 ? `(${taxPercentage.toFixed(1)}%)` : ''}</span>
                  <span>${(orderDetails.tax || 0).toFixed(2)}</span>
                </div>

                {(orderDetails.discount || 0) > 0 && (
                  <div className="summary-row discount">
                    <span>Discount</span>
                    <span>-${(orderDetails.discount || 0).toFixed(2)}</span>
                  </div>
                )}

                <div className="summary-row shipping">
                  <span>Shipping</span>
                  <span className="free">FREE</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total">
                  <span>Total</span>
                  <span>${(orderDetails.total || 0).toFixed(2)}</span>
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
