"use client"
import { useWishlist } from "../hooks/useWishlist"
import { useState, useEffect } from "react"
import ProductCard from "./ProductCard"
import { fetchAllProducts } from "../utils/productApi"
import "../styles/FeaturedDesserts.css"

function FeaturedDesserts({ addToCart, addToWishlist, wishlistItems }) {
  const { isInWishlist, toggleWishlist, loading } = useWishlist()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      try {
        const fetchedProducts = await fetchAllProducts("desert")
        setProducts(fetchedProducts.slice(0, 6)) // Show first 6 products
      } catch (error) {
        console.error("Error loading products:", error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }
    loadProducts()
  }, [])

  const handleWishlistToggle = async (product) => {
    setActionLoading(product._id)
    try {
      const result = await toggleWishlist(product)
      if (result.success) {
        // Success message is handled by the hook
      } else {
        alert(`Error: ${result.message}`)
      }
    } catch (err) {
      alert("Failed to update wishlist")
    } finally {
      setActionLoading(null)
    }
  }

  if (isLoading) {
    return (
      <section className="featured-desserts">
        <div className="featured-container">
          <h2>Featured Desserts</h2>
          <p style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>Loading desserts...</p>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="featured-desserts">
        <div className="featured-container">
          <h2>Featured Desserts</h2>
          <p style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
            No desserts available at the moment.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="featured-desserts">
      <div className="featured-container">
        <h2>Featured Desserts</h2>
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={addToCart}
              onAddToWishlist={addToWishlist}
              isInWishlist={wishlistItems?.some((item) => item._id === product._id) || false}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedDesserts
