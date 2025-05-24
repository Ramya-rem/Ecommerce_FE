"use client"
import { FaHeart, FaShoppingCart } from "react-icons/fa"
import "../styles/FeaturedDesserts.css"

function FeaturedDesserts({ addToCart, addToWishlist, wishlistItems }) {
  const products = [
    {
      id: 1,
      name: "🍓 Strawberry Cake",
      description: "Fresh strawberries with cream cheese frosting",
      price: 24.99,
      image: "https://placehold.co/600x400",
      badge: "Popular",
    },
    {
      id: 2,
      name: "🍫 Choco Lava",
      description: "Warm chocolate cake with molten center",
      price: 19.99,
      image: "https://placehold.co/600x400",
    },
    {
      id: 3,
      name: "🥥 Coconut Cake",
      description: "Light coconut cake with coconut flakes",
      price: 22.99,
      image: "https://placehold.co/600x400",
      badge: "New",
    },
  ]

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId)
  }

  return (
    <section className="featured-desserts">
      <div className="featured-container">
        <h2>Featured Desserts</h2>
        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-image-container">
                <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-image" />
                {product.badge && <span className="product-badge">{product.badge}</span>}
              </div>
              <div className="product-details">
                <div className="product-header">
                  <h3>{product.name}</h3>
                  <button
                    className={`wishlist-button ${isInWishlist(product.id) ? "active" : ""}`}
                    onClick={() => addToWishlist(product)}
                  >
                    <FaHeart />
                  </button>
                </div>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">${product.price.toFixed(2)}</span>
                  <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                    <FaShoppingCart />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedDesserts
