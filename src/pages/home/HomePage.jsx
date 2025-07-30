"use client"

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

  const addToCart = (product) => {
    setCartItems([...cartItems, product])
    alert(`${product.name} added to cart!`)
  }

  const addToWishlist = (updatedWishlist) => {
    setWishlistItems(updatedWishlist)
    setWishlistItemCount(updatedWishlist.length)
  }

  return (
    <div className="app">
      <Header cartItemCount={cartItems.length} wishlistItemCount={wishlistItemCount} />
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
