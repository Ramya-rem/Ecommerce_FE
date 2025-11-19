"use client"

import { FaHeart, FaShoppingCart } from "react-icons/fa"
import "./ProductCard.css"

const ProductCard = ({ product, onAddToCart, onAddToWishlist, isInWishlist }) => {
  const handleAddToCart = () => {
    onAddToCart(product)
  }

  const handleAddToWishlist = () => {
    onAddToWishlist(product)
  }

  // Construct image URL with backend base URL
  const imageUrl = product.image 
    ? `${import.meta.env.VITE_BASE_URL}${product.image}` 
    : "/placeholder.svg"

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={imageUrl} alt={product.productName} className="product-image" />
        <button
          className={`wishlist-btn ${isInWishlist ? "active" : ""}`}
          onClick={handleAddToWishlist}
          aria-label="Add to wishlist"
        >
          <FaHeart />
        </button>
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.productName}</h3>
        {product.category && <p className="product-category">{product.category}</p>}
        {product.description && <p className="product-description">{product.description}</p>}

        <div className="product-footer">
          <span className="product-price">₹{product.price}</span>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            <FaShoppingCart />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
