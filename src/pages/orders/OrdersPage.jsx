import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import api from "../../utils/api"
import "./ordersPage.css"

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHeaderCounts = async () => {
      try {
        const [cartRes, wishlistRes] = await Promise.all([
          api.get("/getUsercart").catch(() => ({ data: { success: false, cartItems: [] } })),
          api.get("/getUserWishlist").catch(() => ({ data: { success: false, wishlistItems: [] } }))
        ])

        if (cartRes?.data?.success) {
          const count = cartRes.data.cartItems.reduce((total, item) => total + (item.quantity || 1), 0)
          setCartCount(count)
        }
        if (wishlistRes?.data?.success) {
          setWishlistCount((wishlistRes.data.wishlistItems || []).length)
        }
      } catch (_) {
        // Best-effort; ignore header count failures
      }
    }

    fetchHeaderCounts()
  }, [])

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get("/fetchuserOrders")
        if (res.data?.success) {
          setOrders(res.data.orders || [])
        } else {
          setOrders([])
        }
      } catch (err) {
        if (err?.response?.status === 404) {
          setOrders([])
        } else {
          setError("Failed to load orders. Please try again.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const formatDate = (isoString) => {
    if (!isoString) return ""
    const date = new Date(isoString)
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
  }

  const getOrderTotals = (order) => {
    const items = order?.orderItems || []
    const total = items.reduce((sum, item) => {
      const price = item?.productRefId?.price || 0
      const quantity = item?.quantity || 1
      return sum + price * quantity
    }, 0)
    return { itemCount: items.length, total }
  }

  if (loading) {
    return (
      <div className="orders-page">
        <Header cartItemCount={cartCount} wishlistItemCount={wishlistCount} />
        <div className="orders-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="orders-page">
        <Header cartItemCount={cartCount} wishlistItemCount={wishlistCount} />
        <div className="orders-container">
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
    <div className="orders-page">
      <Header cartItemCount={cartCount} wishlistItemCount={wishlistCount} />

      <div className="orders-container">
        <div className="orders-header">
          <div className="header-content">
            <Link to="/home" className="back-link">
              <FaArrowLeft />
              Back to Home
            </Link>
            <h1>My Orders</h1>
            <p className="orders-count">{orders.length} orders</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <h2>No orders yet</h2>
            <p>Looks like you haven't placed any orders. Start shopping to place your first order!</p>
            <Link to="/home" className="continue-shopping-btn">Continue Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const { itemCount, total } = getOrderTotals(order)
              return (
                <div className="order-card" key={order._id}>
                  <div className="order-card-header">
                    <div className="order-meta">
                      <div className="order-id">Order #{order._id?.slice(-6)}</div>
                      <div className="order-date">{formatDate(order.createdAt)}</div>
                    </div>
                    <div className="order-summary">
                      <span>{itemCount} items</span>
                      <span className="order-total">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="order-items">
                    {(order.orderItems || []).map((item, idx) => (
                      <div className="order-item" key={idx}>
                        <div className="order-item-image">
                          {item?.productRefId?.image ? (
                            <img src={`http://localhost:7777${item.productRefId.image}`} alt={item?.productRefId?.productName || "Product"} />
                          ) : (
                            <div className="image-placeholder" />
                          )}
                        </div>
                        <div className="order-item-details">
                          <div className="name">{item?.productRefId?.productName || "Product"}</div>
                          <div className="meta">
                            <span className="price">${(item?.productRefId?.price || 0).toFixed(2)}</span>
                            <span className="quantity">× {item?.quantity || 1}</span>
                            <span className="subtotal">${(((item?.productRefId?.price || 0) * (item?.quantity || 1)) || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default OrdersPage


