import { useState } from "react"
import Header from "../../components/Header"
import HeroSection from "../../components/HeroSection"
import Categories from "../../components/Categories"
import FeaturedDesserts from "../../components/FeaturedDesserts"
import Offer from "../../components/Offer"
import CustomerReview from "../../components/CustomerReview"
import Footer from "../../components/Footer"
import { useWishlist } from "../../hooks/useWishlist"
import "./home.css"

const HomePage = () => {
  const [cartItems, setCartItems] = useState([])
  const { wishlistItems, wishlistCount, toggleWishlist, isInWishlist } = useWishlist()

  const addToCart = (product) => {
    setCartItems([...cartItems, product])
    alert(`${product.name || product.productName} added to cart!`)
  }

  const handleWishlistToggle = async (product) => {
    try {
      return await toggleWishlist(product)
    } catch (error) {
      console.error("Failed to toggle wishlist from home page:", error)
      return { success: false, message: "Unable to update wishlist. Please try again." }
    }
  }

  return (
    <div className="app">
      <Header cartItemCount={cartItems.length} wishlistItemCount={wishlistCount} />
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
