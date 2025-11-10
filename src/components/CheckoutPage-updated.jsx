import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import StripePayment from "../../components/StripePayment"
import "./CheckoutPage.css"
import api from "../../utils/api"

const CheckoutPage = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [wishlistItemCount, setWishlistItemCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    tax: 0,
    shipping: "FREE",
    total: 0,
  })
  const [selectedAddress, setSelectedAddress] = useState(null) // Declared selectedAddress variable
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponCode, setCouponCode] = useState("")
  const [couponError, setCouponError] = useState("")
  const [showStripePayment, setShowStripePayment] = useState(false) // Changed from showUPIPayment to showStripePayment

  // Available coupons (in a real app, this would come from an API)
  const availableCoupons = [
    { code: "WELCOME10", discount: 10, type: "percentage", minOrder: 30 },
    { code: "FREESHIP", discount: 5, type: "fixed", minOrder: 0 },
    { code: "NEWUSER", discount: 15, type: "percentage", minOrder: 50 },
  ]

  // Calculate total function
  const calculateTotal = () => {
    let total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    if (appliedCoupon) {
      if (appliedCoupon.type === "percentage") {
        total -= (total * appliedCoupon.discount) / 100
      } else if (appliedCoupon.type === "fixed") {
        total -= appliedCoupon.discount
      }
    }
    return total
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address")
      return
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty!")
      return
    }

    if (paymentMethod === "card") {
      // Changed from "upi" to "card"
      setShowStripePayment(true)
    } else {
      // Cash on Delivery
      try {
        setLoading(true)

        const deliveryAddress = {
          fullName: selectedAddress.name,
          phoneNumber: selectedAddress.phone,
          addressLine: `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.zipCode}`,
        }

        const orderData = {
          deliveryAddress,
          editAddress: true,
        }

        const response = await api.post("/place-order", orderData)

        if (response.status === 201) {
          localStorage.setItem("cartItems", JSON.stringify(cartItems))
          localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress))

          alert("Order placed successfully! Thank you for your purchase.")
          navigate("/order-success", {
            state: {
              orderId: response.data.orderId,
              totalAmount: response.data.totalAmount,
            },
          })
        }
      } catch (error) {
        console.error("Error placing order:", error)
        const errorMessage = error.response?.data?.message || "Failed to place order. Please try again."
        alert(errorMessage)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleStripeSuccess = async (paymentData) => {
    console.log("Stripe payment successful:", paymentData)
    setShowStripePayment(false)

    try {
      setLoading(true)

      const deliveryAddress = {
        fullName: selectedAddress.name,
        phoneNumber: selectedAddress.phone,
        addressLine: `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.zipCode}`,
      }

      const orderData = {
        deliveryAddress,
        editAddress: true,
        paymentMethod: "card",
        paymentData: paymentData,
      }

      const response = await api.post("/place-order", orderData)

      if (response.status === 201) {
        localStorage.setItem("cartItems", JSON.stringify(cartItems))
        localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress))
        localStorage.setItem("paymentData", JSON.stringify(paymentData))

        navigate("/order-success", {
          state: {
            orderId: response.data.orderId,
            totalAmount: response.data.totalAmount,
          },
        })
      }
    } catch (error) {
      console.error("Error placing order after card payment:", error)
      const errorMessage =
        error.response?.data?.message || "Payment successful but order placement failed. Please contact support."
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleStripeFailure = (error) => {
    console.error("Stripe payment failed:", error)
    alert(`Payment failed: ${error}`)
  }

  const handleStripeClose = () => {
    setShowStripePayment(false)
  }

  return (
    <div className="checkout-page">
      <Header
        cartItemCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
        wishlistItemCount={wishlistItemCount}
      />

      <div className="checkout-container">
        {/* ... existing header ... */}

        <div className="checkout-content">
          <div className="checkout-main">
            {/* ... existing sections ... */}

            {/* Payment Method Section */}
            <section className="checkout-section payment-section">
              <div className="section-header">
                <h2>Payment Method</h2>
              </div>

              <div className="payment-options">
                <div className="payment-option">
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <label htmlFor="cod">Cash on Delivery</label>
                </div>
                <div className="payment-option">
                  <input
                    type="radio"
                    id="card" // Changed from "upi" to "card"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  <label htmlFor="card">Credit/Debit Card</label> {/* Updated label */}
                </div>
              </div>

              {paymentMethod === "card" && ( // Changed from "upi" to "card"
                <div className="upi-details">
                  {" "}
                  {/* reusing existing styles */}
                  <p>You will be able to pay using your credit or debit card securely via Stripe.</p>
                  <div className="upi-benefits">
                    <h4>Benefits of Card Payment:</h4>
                    <ul>
                      <li>✅ Instant payment confirmation</li>
                      <li>✅ Secure and encrypted transactions</li>
                      <li>✅ Support for all major cards (Visa, Mastercard, Amex)</li>
                      <li>✅ Fraud protection</li>
                    </ul>
                  </div>
                </div>
              )}
            </section>

            {/* ... existing coupon section ... */}
          </div>

          {/* ... existing sidebar ... */}
        </div>
      </div>

      {/* Stripe Payment Modal */}
      {showStripePayment && (
        <StripePayment
          amount={calculateTotal()}
          orderId={`ORD${Date.now()}`}
          onSuccess={handleStripeSuccess}
          onFailure={handleStripeFailure}
          onClose={handleStripeClose}
        />
      )}

      <Footer />
    </div>
  )
}

export default CheckoutPage
