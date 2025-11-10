"use client"

import { useState } from "react"
import { FaCreditCard, FaCheckCircle, FaTimes, FaSpinner } from "react-icons/fa"
import "./StripePayment.css"

const StripePayment = ({ amount, orderId, onSuccess, onFailure, onClose }) => {
  const [paymentStatus, setPaymentStatus] = useState("pending") // pending, processing, success, failed
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardholderName, setCardholderName] = useState("")
  const [error, setError] = useState("")

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, "")
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ")
    return formatted.slice(0, 19)
  }

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
    }
    return cleaned
  }

  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value))
    setError("")
  }

  const handleExpiryChange = (e) => {
    setExpiryDate(formatExpiryDate(e.target.value))
    setError("")
  }

  const handleCVVChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
    setCvv(value)
    setError("")
  }

  const validateCardDetails = () => {
    const cleanCardNumber = cardNumber.replace(/\s/g, "")

    if (!cardholderName.trim()) {
      setError("Cardholder name is required")
      return false
    }

    if (cleanCardNumber.length !== 16) {
      setError("Card number must be 16 digits")
      return false
    }

    // Simple Luhn algorithm validation
    if (!luhnCheck(cleanCardNumber)) {
      setError("Invalid card number")
      return false
    }

    const [month, year] = expiryDate.split("/")
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      setError("Expiry date must be in MM/YY format")
      return false
    }

    const monthNum = Number.parseInt(month)
    const yearNum = Number.parseInt(year)
    if (monthNum < 1 || monthNum > 12) {
      setError("Invalid expiry month")
      return false
    }

    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1

    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
      setError("Card has expired")
      return false
    }

    if (cvv.length < 3) {
      setError("CVV must be at least 3 digits")
      return false
    }

    return true
  }

  const luhnCheck = (cardNumber) => {
    let sum = 0
    let isEven = false

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = Number.parseInt(cardNumber[i])

      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }

      sum += digit
      isEven = !isEven
    }

    return sum % 10 === 0
  }

  const handlePayment = async () => {
    if (!validateCardDetails()) {
      return
    }

    setPaymentStatus("processing")
    setError("")

    try {
      // Simulate payment processing - in production use actual Stripe API
      setTimeout(() => {
        setPaymentStatus("success")
        onSuccess({
          transactionId: `stripe_${Date.now()}`,
          amount: amount,
          method: "Card",
          cardLast4: cardNumber.slice(-4),
          cardholderName: cardholderName,
          timestamp: new Date().toISOString(),
        })
      }, 2000)
    } catch (err) {
      console.error("Payment error:", err)
      setError(err.message || "An error occurred while processing payment")
      setPaymentStatus("failed")
      onFailure(err.message)
    }
  }

  if (paymentStatus === "success") {
    return (
      <div className="stripe-payment-overlay">
        <div className="stripe-payment-modal success">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          <h2>Payment Successful!</h2>
          <p>Your payment of ${amount.toFixed(2)} has been processed successfully.</p>
          <button className="close-btn" onClick={onClose}>
            Continue
          </button>
        </div>
      </div>
    )
  }

  if (paymentStatus === "failed") {
    return (
      <div className="stripe-payment-overlay">
        <div className="stripe-payment-modal failed">
          <div className="failed-icon">
            <FaTimes />
          </div>
          <h2>Payment Failed</h2>
          <p>Your payment could not be processed. Please try again.</p>
          <div className="failed-actions">
            <button
              className="retry-btn"
              onClick={() => {
                setPaymentStatus("pending")
                setError("")
              }}
            >
              Retry Payment
            </button>
            <button className="close-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="stripe-payment-overlay">
      <div className="stripe-payment-modal">
        <div className="stripe-header">
          <h2>
            <FaCreditCard /> Card Payment
          </h2>
          <button className="close-btn-header" onClick={onClose} disabled={paymentStatus === "processing"}>
            <FaTimes />
          </button>
        </div>

        <div className="stripe-content">
          <div className="payment-amount">
            <p>Amount to pay</p>
            <h3>${amount.toFixed(2)}</h3>
          </div>

          {paymentStatus === "processing" ? (
            <div className="processing-state">
              <FaSpinner className="spinner" />
              <h3>Processing Payment...</h3>
              <p>Please wait while we verify your card.</p>
            </div>
          ) : (
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="cardholderName">Cardholder Name</label>
                <input
                  type="text"
                  id="cardholderName"
                  placeholder="John Doe"
                  value={cardholderName}
                  onChange={(e) => {
                    setCardholderName(e.target.value)
                    setError("")
                  }}
                  disabled={paymentStatus === "processing"}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength="19"
                  disabled={paymentStatus === "processing"}
                  required
                />
                <small className="card-info">Enter a 16-digit card number</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date</label>
                  <input
                    type="text"
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    maxLength="5"
                    disabled={paymentStatus === "processing"}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    placeholder="123"
                    value={cvv}
                    onChange={handleCVVChange}
                    maxLength="4"
                    disabled={paymentStatus === "processing"}
                    required
                  />
                  <small className="card-info">3-4 digits on back</small>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                type="button"
                className="pay-button"
                onClick={handlePayment}
                disabled={paymentStatus === "processing" || !cardNumber || !expiryDate || !cvv || !cardholderName}
              >
                {paymentStatus === "processing" ? (
                  <>
                    <FaSpinner className="spinner" />
                    Processing...
                  </>
                ) : (
                  `Pay $${amount.toFixed(2)}`
                )}
              </button>

              <div className="security-info">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <p>Your card details are secure and encrypted</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default StripePayment
