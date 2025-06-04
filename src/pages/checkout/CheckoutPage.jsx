
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaArrowLeft, FaEdit, FaPlus, FaCheck, FaMapMarkerAlt, FaPercent } from "react-icons/fa"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import "./CheckoutPage.css"

const CheckoutPage = () => {
  const navigate = useNavigate()
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
  ])

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "John Doe",
      phone: "123-456-7890",
      address: "123 Baker Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      isDefault: true,
    },
  ])

  const [selectedAddress, setSelectedAddress] = useState(addresses.find((addr) => addr.isDefault) || null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: false,
  })
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponCode, setCouponCode] = useState("")
  const [couponError, setCouponError] = useState("")

  // Available coupons (in a real app, this would come from an API)
  const availableCoupons = [
    { code: "WELCOME10", discount: 10, type: "percentage", minOrder: 30 },
    { code: "FREESHIP", discount: 5, type: "fixed", minOrder: 0 },
    { code: "NEWUSER", discount: 15, type: "percentage", minOrder: 50 },
  ]

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.08 // 8% tax
  }

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0

    const subtotal = calculateSubtotal()
    if (subtotal < appliedCoupon.minOrder) return 0

    if (appliedCoupon.type === "percentage") {
      return (subtotal * appliedCoupon.discount) / 100
    } else {
      return appliedCoupon.discount
    }
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - calculateDiscount()
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address)
  }

  const handleAddNewAddress = () => {
    setShowAddressForm(true)
    setEditingAddress(null)
    setNewAddress({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      isDefault: false,
    })
  }

  const handleEditAddress = (address) => {
    setShowAddressForm(true)
    setEditingAddress(address)
    setNewAddress({ ...address })
  }

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target
    setNewAddress({
      ...newAddress,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleAddressSubmit = (e) => {
    e.preventDefault()

    if (editingAddress) {
      // Update existing address
      const updatedAddresses = addresses.map((addr) =>
        addr.id === editingAddress.id ? { ...newAddress, id: editingAddress.id } : addr,
      )
      setAddresses(updatedAddresses)
      setSelectedAddress({ ...newAddress, id: editingAddress.id })
    } else {
      // Add new address
      const newId = addresses.length > 0 ? Math.max(...addresses.map((addr) => addr.id)) + 1 : 1
      const addressToAdd = { ...newAddress, id: newId }
      setAddresses([...addresses, addressToAdd])
      setSelectedAddress(addressToAdd)
    }

    // If this is set as default, update other addresses
    if (newAddress.isDefault) {
      const updatedAddresses = addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === (editingAddress ? editingAddress.id : null) ? true : false,
      }))
      setAddresses(updatedAddresses)
    }

    setShowAddressForm(false)
  }

  const handleApplyCoupon = () => {
    const coupon = availableCoupons.find((c) => c.code === couponCode.toUpperCase())

    if (!coupon) {
      setCouponError("Invalid coupon code")
      return
    }

    if (calculateSubtotal() < coupon.minOrder) {
      setCouponError(`Minimum order amount of $${coupon.minOrder.toFixed(2)} required`)
      return
    }

    setAppliedCoupon(coupon)
    setCouponError("")
    setCouponCode("")
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
    setCouponError("")
  }

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      alert("Please select a delivery address")
      return
    }

    // In a real app, you would send the order to your backend
    alert("Order placed successfully! Thank you for your purchase.")
    navigate("/order-success")
  }

  return (
    <div className="checkout-page">
      <Header cartItemCount={cartItems.reduce((total, item) => total + item.quantity, 0)} wishlistItemCount={0} />

      <div className="checkout-container">
        <div className="checkout-header">
          <Link to="/cart" className="back-link">
            <FaArrowLeft />
            Back to Cart
          </Link>
          <h1>Checkout</h1>
        </div>

        <div className="checkout-content">
          <div className="checkout-main">
            {/* Delivery Address Section */}
            <section className="checkout-section address-section">
              <div className="section-header">
                <h2>
                  <FaMapMarkerAlt className="section-icon" />
                  Delivery Address
                </h2>
                {!showAddressForm && (
                  <button className="add-new-btn" onClick={handleAddNewAddress}>
                    <FaPlus /> Add New Address
                  </button>
                )}
              </div>

              {showAddressForm ? (
                <form className="address-form" onSubmit={handleAddressSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={newAddress.name}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={newAddress.phone}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Street Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={newAddress.address}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={newAddress.city}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="state">State</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={newAddress.state}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="zipCode">ZIP Code</label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={newAddress.zipCode}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group checkbox-group">
                    <input
                      type="checkbox"
                      id="isDefault"
                      name="isDefault"
                      checked={newAddress.isDefault}
                      onChange={handleAddressChange}
                    />
                    <label htmlFor="isDefault">Set as default address</label>
                  </div>

                  <div className="form-buttons">
                    <button type="submit" className="save-address-btn">
                      {editingAddress ? "Update Address" : "Save Address"}
                    </button>
                    <button type="button" className="cancel-btn" onClick={() => setShowAddressForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : addresses.length > 0 ? (
                <div className="address-list">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`address-card ${selectedAddress?.id === address.id ? "selected" : ""}`}
                      onClick={() => handleAddressSelect(address)}
                    >
                      <div className="address-card-content">
                        <div className="address-name">{address.name}</div>
                        <div className="address-phone">{address.phone}</div>
                        <div className="address-details">
                          {address.address}, {address.city}, {address.state} {address.zipCode}
                        </div>
                        {address.isDefault && <div className="default-badge">Default</div>}
                      </div>
                      <div className="address-actions">
                        <button
                          className="edit-address-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditAddress(address)
                          }}
                        >
                          <FaEdit />
                        </button>
                        {selectedAddress?.id === address.id && (
                          <div className="selected-indicator">
                            <FaCheck />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-address">
                  <p>No addresses saved. Please add a delivery address.</p>
                </div>
              )}
            </section>

            {/* Order Items Section */}
            <section className="checkout-section order-items-section">
              <div className="section-header">
                <h2>Order Items</h2>
                <span className="item-count">{cartItems.length} items</span>
              </div>

              <div className="order-items">
                {cartItems.map((item) => (
                  <div className="order-item" key={item.id}>
                    <div className="item-image-container">
                      <img src={item.image || "/placeholder.svg"} alt={item.name} className="item-image" />
                    </div>
                    <div className="item-details">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-description">{item.description}</p>
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
                    id="upi"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                  />
                  <label htmlFor="upi">UPI Payment</label>
                </div>
              </div>

              {paymentMethod === "upi" && (
                <div className="upi-details">
                  <p>You will be redirected to complete the UPI payment after placing the order.</p>
                </div>
              )}
            </section>

            {/* Coupon Section */}
            <section className="checkout-section coupon-section">
              <div className="section-header">
                <h2>
                  <FaPercent className="section-icon" />
                  Apply Coupon
                </h2>
              </div>

              {appliedCoupon ? (
                <div className="applied-coupon">
                  <div className="coupon-info">
                    <span className="coupon-code">{appliedCoupon.code}</span>
                    <span className="coupon-discount">
                      {appliedCoupon.type === "percentage"
                        ? `${appliedCoupon.discount}% off`
                        : `$${appliedCoupon.discount.toFixed(2)} off`}
                    </span>
                  </div>
                  <button className="remove-coupon-btn" onClick={handleRemoveCoupon}>
                    Remove
                  </button>
                </div>
              ) : (
                <div className="coupon-form">
                  <div className="coupon-input-group">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button className="apply-coupon-btn" onClick={handleApplyCoupon} disabled={!couponCode.trim()}>
                      Apply
                    </button>
                  </div>
                  {couponError && <div className="coupon-error">{couponError}</div>}
                </div>
              )}
            </section>
          </div>

          <div className="checkout-sidebar">
            <div className="order-summary">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Tax (8%)</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>

              {appliedCoupon && (
                <div className="summary-row discount">
                  <span>Discount ({appliedCoupon.type === "percentage" ? `${appliedCoupon.discount}%` : "Fixed"})</span>
                  <span>-${calculateDiscount().toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row shipping">
                <span>Shipping</span>
                <span className="free">FREE</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>

              <button className="place-order-btn" onClick={handlePlaceOrder} disabled={!selectedAddress}>
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CheckoutPage
