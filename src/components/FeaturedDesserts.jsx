import { useState, useEffect } from "react"
import ProductCard from "./ProductCard"
import { fetchAllProducts } from "../utils/ProductApi";
import "../styles/FeaturedDesserts.css"

function FeaturedDesserts({ addToCart, onToggleWishlist, wishlistItems = [], isInWishlist }) {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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
    if (!onToggleWishlist) return
    try {
      const result = await onToggleWishlist(product)
      if (result?.success === false) {
        alert(`Error: ${result.message}`)
      }
    } catch (err) {
      console.error("Failed to update wishlist:", err)
      alert("Failed to update wishlist")
    } finally {
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
              onAddToWishlist={() => handleWishlistToggle(product)}
              isInWishlist={
                typeof isInWishlist === "function"
                  ? isInWishlist(product._id)
                  : wishlistItems?.some(
                      (item) => item._id === product._id || item.id === product._id
                    ) || false
              }
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedDesserts
