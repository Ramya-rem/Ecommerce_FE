import { useState, useEffect, useCallback } from "react"
import Header from "../../components/Header"
import HeroSection from "../../components/HeroSection"
import Categories from "../../components/Categories"
import FeaturedDesserts from "../../components/FeaturedDesserts"
import Offer from "../../components/Offer"
import CustomerReview from "../../components/CustomerReview"
import Footer from "../../components/Footer"
import { useWishlist } from "../../hooks/useWishlist"
import api from "../../utils/api"
import "./home.css"

const HomePage = () => {
  const [cartItems, setCartItems] = useState([])
  const [isNewUser, setIsNewUser] = useState(true) // Default to true, will check on mount
  const [checkingUserStatus, setCheckingUserStatus] = useState(true)
  const { wishlistItems, wishlistCount, toggleWishlist, isInWishlist } = useWishlist()

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      setCartItems([])
      return
    }

    try {
      const response = await api.get("/getUsercart")
      if (response.data?.success) {
        setCartItems(response.data.cartItems || [])
      }
    } catch (error) {
      console.error("Failed to load cart items:", error)
    }
  }, [])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  // Check if user is new (has no orders)
  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem("authToken")
      if (!token) {
        setCheckingUserStatus(false)
        setIsNewUser(true) // Show offer to non-logged-in users (they haven't ordered)
        return
      }

      try {
        const response = await api.get("/fetchuserOrders")
        if (response.data?.success) {
          const orders = response.data.orders || []
          // User is new if they have no orders
          setIsNewUser(orders.length === 0)
        } else {
          setIsNewUser(true) // If API fails, assume new user
        }
      } catch (error) {
        // If 404 or no orders, user is new
        if (error.response?.status === 404) {
          setIsNewUser(true)
        } else {
          // For other errors, don't show offer to be safe
          setIsNewUser(false)
        }
      } finally {
        setCheckingUserStatus(false)
      }
    }

    checkUserStatus()
  }, [])

  const addToCart = async (product) => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      alert("Please log in to add items to your cart.")
      return
    }

    try {
      const productId = product._id || product.id
      if (!productId) {
        throw new Error("Invalid product identifier")
      }

      await api.post("/addtocart", {
        productId,
        quantity: 1,
      })

      await fetchCart()
      alert(`${product.productName || product.name} added to cart!`)
    } catch (error) {
      console.error("Add to cart failed:", error)
      const message =
        error.response?.data?.message || "Failed to add item to cart. Please try again."
      alert(message)
    }
  }

  const handleWishlistToggle = async (product) => {
    try {
      return await toggleWishlist(product)
    } catch (error) {
      console.error("Failed to toggle wishlist from home page:", error)
      return { success: false, message: "Unable to update wishlist. Please try again." }
    }
  }

  const cartItemCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  )

  return (
    <div className="app">
      <Header cartItemCount={cartItemCount} wishlistItemCount={wishlistCount} />
      <div className="content-wrapper">
        <HeroSection />
        <Categories />
        <div className="lower-sections">
          <FeaturedDesserts
            addToCart={addToCart}
            wishlistItems={wishlistItems}
            isInWishlist={isInWishlist}
            onToggleWishlist={handleWishlistToggle}
          />
          {!checkingUserStatus && isNewUser && <Offer />}
          <CustomerReview />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default HomePage
