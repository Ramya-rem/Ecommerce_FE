"use client"

import { useState, useEffect } from "react"
import { FaQrcode, FaCopy, FaCheckCircle, FaTimes, FaSpinner } from "react-icons/fa"
import "./UPIPayment.css"

const UPIPayment = ({ amount, orderId, onSuccess, onFailure, onClose }) => {
  const [paymentStatus, setPaymentStatus] = useState("pending") // pending, processing, success, failed
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [upiId, setUpiId] = useState("")
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes timeout
  const [copied, setCopied] = useState(false)

  // UPI payment details
  const merchantUPI = "merchant@paytm" // Replace with actual merchant UPI ID
  const merchantName = "Crave & Conquer Bakery"

  // Generate UPI payment URL
  const generateUPIUrl = () => {
    const upiUrl = `upi://pay?pa=${merchantUPI}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Order ${orderId}`)}`
    return upiUrl
  }

  // Generate QR Code URL (using a QR code service)
  const generateQRCode = () => {
    const upiUrl = generateUPIUrl()
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`
    setQrCodeUrl(qrUrl)
  }

  useEffect(() => {
    generateQRCode()

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setPaymentStatus("failed")
          onFailure("Payment timeout")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Simulate payment verification (In real implementation, this would be done via webhook)
  const simulatePaymentVerification = () => {
    setPaymentStatus("processing")

    // Simulate API call to verify payment
    setTimeout(() => {
      // In a real scenario, you would check with your payment gateway
      const isPaymentSuccessful = Math.random() > 0.3 // 70% success rate for demo

      if (isPaymentSuccessful) {
        setPaymentStatus("success")
        onSuccess({
          transactionId: `TXN${Date.now()}`,
          amount: amount,
          method: "UPI",
          timestamp: new Date().toISOString(),
        })
      } else {
        setPaymentStatus("failed")
        onFailure("Payment verification failed")
      }
    }, 3000)
  }

  const copyUPIId = () => {
    navigator.clipboard.writeText(merchantUPI)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyAmount = () => {
    navigator.clipboard.writeText(amount.toString())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleManualUPIPayment = () => {
    if (upiId.trim()) {
      simulatePaymentVerification()
    } else {
      alert("Please enter your UPI ID")
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (paymentStatus === "success") {
    return (
      <div className="upi-payment-modal">
        <div className="upi-payment-content success">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          <h2>Payment Successful!</h2>
          <p>Your payment of ₹{amount} has been processed successfully.</p>
          <button className="close-btn" onClick={onClose}>
            Continue
          </button>
        </div>
      </div>
    )
  }

  if (paymentStatus === "failed") {
    return (
      <div className="upi-payment-modal">
        <div className="upi-payment-content failed">
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
                setTimeLeft(300)
                generateQRCode()
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
    <div className="upi-payment-modal">
      <div className="upi-payment-content">
        <div className="upi-header">
          <h2>UPI Payment</h2>
          <button className="close-modal-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="payment-details">
          <div className="amount-display">
            <span className="amount">₹{amount}</span>
            <span className="order-id">Order #{orderId}</span>
          </div>

          <div className="timer">
            <span>Time remaining: {formatTime(timeLeft)}</span>
          </div>
        </div>

        {paymentStatus === "processing" ? (
          <div className="processing-state">
            <FaSpinner className="spinner" />
            <h3>Verifying Payment...</h3>
            <p>Please wait while we confirm your payment.</p>
          </div>
        ) : (
          <>
            {/* QR Code Payment */}
            <div className="payment-method">
              <h3>
                <FaQrcode /> Scan QR Code
              </h3>
              <div className="qr-section">
                <div className="qr-code">
                  <img src={qrCodeUrl || "/placeholder.svg"} alt="UPI QR Code" />
                </div>
                <p>Scan this QR code with any UPI app</p>
                <div className="upi-apps">
                  <span>Supported apps:</span>
                  <div className="app-icons">
                    <span>📱 PhonePe</span>
                    <span>💳 Paytm</span>
                    <span>🏦 Google Pay</span>
                    <span>💰 BHIM</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="divider">
              <span>OR</span>
            </div>

            {/* Manual UPI Payment */}
            <div className="payment-method">
              <h3>Pay Manually</h3>
              <div className="manual-payment">
                <div className="payment-info">
                  <div className="info-row">
                    <span>UPI ID:</span>
                    <div className="copy-field">
                      <span>{merchantUPI}</span>
                      <button onClick={copyUPIId} className="copy-btn">
                        <FaCopy /> {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                  <div className="info-row">
                    <span>Amount:</span>
                    <div className="copy-field">
                      <span>₹{amount}</span>
                      <button onClick={copyAmount} className="copy-btn">
                        <FaCopy /> {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="manual-form">
                  <label htmlFor="user-upi">Enter your UPI ID after payment:</label>
                  <input
                    type="text"
                    id="user-upi"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                  <button className="verify-payment-btn" onClick={handleManualUPIPayment} disabled={!upiId.trim()}>
                    Verify Payment
                  </button>
                </div>
              </div>
            </div>

            <div className="payment-instructions">
              <h4>Payment Instructions:</h4>
              <ol>
                <li>Open any UPI app on your phone</li>
                <li>Scan the QR code or enter the UPI ID manually</li>
                <li>Enter the exact amount: ₹{amount}</li>
                <li>Complete the payment</li>
                <li>If paying manually, enter your UPI ID above and click verify</li>
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default UPIPayment
