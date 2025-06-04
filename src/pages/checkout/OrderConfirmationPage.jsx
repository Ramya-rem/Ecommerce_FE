import { useState } from "react"
import { Link } from "react-router-dom"
import { FaCheckCircle, FaBox, FaMapMarkerAlt, FaReceipt } from "react-icons/fa"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import "./OrderConfirmationPage.css"

const OrderConfirmationPage = () => {
  const [orderDetails, setOrderDetails] = useState({
    orderId: "ORD-" + Math.floor(100000 + Math.random() * 900000),
    orderDate: new Date().toLocaleDateString(),
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    items: [
      {
        id: 1,
        name: "🍓 Strawberry Cake",
        price: 24.99,
        quantity: 2,
        image: "https://placehold.co/600x400",
      },
      {
        id: 2,
        name: "🍫 Choco Lava",
        price: 19.99,
        quantity: 1,
        image: "https://placehold.co/600x400",
      },
    ],
    address: {
      name: "John Doe",
      phone: "123-456-7890",
      address: "123 Baker Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
    paymentMethod: "Cash on Delivery",
    subtotal: 69.97,
    tax: 5.6,
    discount: 7.0,
    total: 68.57,
  })

  return (
    <div className="confirmation-page">
      <Header cartItemCount={0} wishlistItemCount={0} />

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
                      <img src={item.image || "/placeholder.svg"} alt={item.name} className="item-image" />
                    </div>
                    <div className="item-details">
                      <h3 className="item-name">{item.name}</h3>
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
