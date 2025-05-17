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

  const addToCart = (product) => {
    setCartItems([...cartItems, product])
    alert(`${product.name} added to cart!`)
  }

  return (
    <div className="app">
      <Header cartItemCount={cartItems.length} />
      <div className="content-wrapper">
        <HeroSection />
        <Categories />
        <div className="lower-sections">
          <FeaturedDesserts addToCart={addToCart} />
          <Offer />
          <CustomerReview />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default HomePage
