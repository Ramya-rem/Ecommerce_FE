import { useState } from "react"
import { Link } from "react-router-dom"
import { FaHeart, FaShoppingCart, FaTrash, FaArrowLeft } from "react-icons/fa"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import "./WishlistPage.css"

const WishlistPage = () => {
  // Sample wishlist data - in real app, this would come from props or context
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "🍓 Strawberry Cake",
      description: "Fresh strawberries with cream cheese frosting",
      price: 24.99,
      image: "https://placehold.co/600x400",
      badge: "Popular",
      dateAdded: "2024-01-15",
    },
    {
      id: 2,
      name: "🍫 Choco Lava",
      description: "Warm chocolate cake with molten center",
      price: 19.99,
      image: "https://placehold.co/600x400",
      dateAdded: "2024-01-14",
    },
    {
      id: 3,
      name: "🥥 Coconut Cake",
      description: "Light coconut cake with coconut flakes",
      price: 22.99,
      image: "https://placehold.co/600x400",
      badge: "New",
      dateAdded: "2024-01-13",
    },
  ])

  const [cartItems, setCartItems] = useState([])

  const removeFromWishlist = (productId) => {
    const productToRemove = wishlistItems.find((item) => item.id === productId)
    setWishlistItems(wishlistItems.filter((item) => item.id !== productId))
    alert(`${productToRemove.name} removed from wishlist!`)
  }

  const addToCart = (product) => {
    setCartItems([...cartItems, product])
    alert(`${product.name} added to cart!`)
  }

  const addToCartAndRemoveFromWishlist = (product) => {
    setCartItems([...cartItems, product])
    setWishlistItems(wishlistItems.filter((item) => item.id !== product.id))
    alert(`${product.name} moved to cart!`)
  }

  const clearAllWishlist = () => {
    if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
      setWishlistItems([])
      alert("Wishlist cleared!")
    }
  }

  const addAllToCart = () => {
    if (wishlistItems.length === 0) return

    setCartItems([...cartItems, ...wishlistItems])
    const itemCount = wishlistItems.length
    setWishlistItems([])
    alert(`${itemCount} items moved to cart!`)
  }

  return (
    <div className="wishlist-page">
      <Header cartItemCount={cartItems.length} wishlistItemCount={wishlistItems.length} />

      <div className="wishlist-container">
        <div className="wishlist-header">
          <div className="header-content">
            <Link to="/home" className="back-link">
              <FaArrowLeft />
              Back to Home
            </Link>
            <h1>My Wishlist</h1>
            <p className="wishlist-count">{wishlistItems.length} items saved</p>
          </div>

          {wishlistItems.length > 0 && (
            <div className="wishlist-actions">
              <button className="add-all-btn" onClick={addAllToCart}>
                <FaShoppingCart />
                Add All to Cart
              </button>
              <button className="clear-all-btn" onClick={clearAllWishlist}>
                <FaTrash />
                Clear All
              </button>
            </div>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-icon">
              <FaHeart />
            </div>
            <h2>Your wishlist is empty</h2>
            <p>Save items you love to your wishlist and shop them later!</p>
            <Link to="/home" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map((item) => (
              <div className="wishlist-item" key={item.id}>
                <div className="item-image-container">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="item-image" />
                  {item.badge && <span className="item-badge">{item.badge}</span>}
                  <button
                    className="remove-btn"
                    onClick={() => removeFromWishlist(item.id)}
                    title="Remove from wishlist"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-description">{item.description}</p>
                  <div className="item-price">${item.price.toFixed(2)}</div>
                  <div className="item-date">Added on {new Date(item.dateAdded).toLocaleDateString()}</div>

                  <div className="item-actions">
                    <button className="add-to-cart-btn" onClick={() => addToCart(item)}>
                      <FaShoppingCart />
                      Add to Cart
                    </button>
                    <button className="move-to-cart-btn" onClick={() => addToCartAndRemoveFromWishlist(item)}>
                      Move to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default WishlistPage
