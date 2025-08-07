import { useState, useEffect } from "react"
import Header from "../../components/Header"
import HeroSection from "../../components/HeroSection"
import Categories from "../../components/Categories"
import FeaturedDesserts from "../../components/FeaturedDesserts"
import Offer from "../../components/Offer"
import CustomerReview from "../../components/CustomerReview"
import Footer from "../../components/Footer"
import "./home.css"
import api from "../../utils/api"

const HomePage = () => {
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [wishlistItemCount, setWishlistItemCount] = useState(0)

  // Fetch wishlist from backend
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await api.get("/getUserWishlist")
        if (response.data.success) {
          setWishlistItems(response.data.wishlistItems)
          setWishlistItemCount(response.data.wishlistCount || 0)
        }
      } catch (error) {
        console.error("Error fetching wishlist", error)
      }
    }

    fetchWishlist()
  }, [])

  // Fetch cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get("/getUsercart")
        if (response.data.success) {
          setCartItems(response.data.cartItems)
        }
      } catch (error) {
        console.error("Error fetching cart", error)
      }
    }

    fetchCart()
  }, [])

  const addToCart = async (product) => {
    try {
      const response = await api.post("/addtocart", {
        productId: product._id,
        quantity: 1
      })
      
      if (response.status === 200) {
        // Refresh cart data from backend
        const cartResponse = await api.get("/getUsercart")
        if (cartResponse.data.success) {
          setCartItems(cartResponse.data.cartItems)
        }
        alert(`${product.productName} added to cart!`)
      }
    } catch (error) {
      console.error("Add to cart failed:", error)
      // Handle 409 status (product already in cart) as a success case
      if (error.response?.status === 409) {
        alert(error.response.data.message || "Product is already in your cart!")
        // Refresh cart data to ensure UI is up to date
        try {
          const cartResponse = await api.get("/getUsercart")
          if (cartResponse.data.success) {
            setCartItems(cartResponse.data.cartItems)
          }
        } catch (refreshError) {
          console.error("Error refreshing cart:", refreshError)
        }
      } else if (error.response?.data?.message) {
        alert(error.response.data.message)
      } else {
        alert("Failed to add item to cart. Please try again.")
      }
    }
  }

  const addToWishlist = (updatedWishlist) => {
    setWishlistItems(updatedWishlist)
    setWishlistItemCount(updatedWishlist.length)
  }

  return (
    <div className="app">
      <Header cartItemCount={cartItems.reduce((total, item) => total + item.quantity, 0)} wishlistItemCount={wishlistItemCount} />
      <main className="main-content">
        <HeroSection />
        <Categories />
        <FeaturedDesserts addToCart={addToCart} addToWishlist={addToWishlist} wishlistItems={wishlistItems} />
        <Offer />
        <CustomerReview />
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
