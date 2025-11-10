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
  const [wishlistItems, setWishlistItems] = useState([])
  const { wishlistCount } = useWishlist()

  const addToCart = (product) => {
    setCartItems([...cartItems, product])
    alert(`${product.name || product.productName} added to cart!`)
  }

  const addToWishlist = (product) => {
    const isAlreadyInWishlist = wishlistItems.some((item) => item._id === product._id)
    if (isAlreadyInWishlist) {
      setWishlistItems(wishlistItems.filter((item) => item._id !== product._id))
    } else {
      setWishlistItems([...wishlistItems, product])
    }
  }

  return (
    <div className="app">
      <Header cartItemCount={cartItems.length} wishlistItemCount={wishlistCount} />
      <div className="content-wrapper">
        <HeroSection />
        <Categories />
        <div className="lower-sections">
          <FeaturedDesserts addToCart={addToCart} addToWishlist={addToWishlist} wishlistItems={wishlistItems} />
          <Offer />
          <CustomerReview />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default HomePage
