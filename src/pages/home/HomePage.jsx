"use client"

import { useState } from "react"
import Header from "../../components/Header"
import HeroSection from "../../components/HeroSection"
import Categories from "../../components/Categories"
import FeaturedDesserts from "../../components/FeaturedDesserts"
import Offer from "../../components/Offer"
import CustomerReview from "../../components/CustomerReview"
import Footer from "../../components/Footer"
import "./home.css"

const HomePage = () => {
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])

  const addToCart = (product) => {
    setCartItems([...cartItems, product])
    alert(`${product.name} added to cart!`)
  }

  const addToWishlist = (product) => {
    const isAlreadyInWishlist = wishlistItems.some((item) => item.id === product.id)

    if (isAlreadyInWishlist) {
      setWishlistItems(wishlistItems.filter((item) => item.id !== product.id))
      alert(`${product.name} removed from wishlist!`)
    } else {
      setWishlistItems([...wishlistItems, product])
      alert(`${product.name} added to wishlist!`)
    }
  }

  return (
    <div className="app">
      <Header cartItemCount={cartItems.length} wishlistItemCount={wishlistItems.length} />
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
