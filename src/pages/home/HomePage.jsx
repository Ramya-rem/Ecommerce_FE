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
          <Offer />
          <CustomerReview />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default HomePage
