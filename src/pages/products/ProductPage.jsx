import { useState, useEffect } from "react"
import { FaHeart, FaShoppingCart, FaFilter, FaTimes, FaSortAmountDown } from "react-icons/fa"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import "./productPage.css"

const ProductsPage = () => {
  // Sample products data - in a real app, this would come from an API
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "🍓 Strawberry Cake",
      description: "Fresh strawberries with cream cheese frosting",
      price: 24.99,
      category: "Cakes",
      image: "https://placehold.co/600x400",
      badge: "Popular",
      rating: 4.8,
      reviews: 124,
    },
    {
      id: 2,
      name: "🍫 Choco Lava",
      description: "Warm chocolate cake with molten center",
      price: 19.99,
      category: "Cakes",
      image: "https://placehold.co/600x400",
      rating: 4.7,
      reviews: 98,
    },
    {
      id: 3,
      name: "🥥 Coconut Cake",
      description: "Light coconut cake with coconut flakes",
      price: 22.99,
      category: "Cakes",
      image: "https://placehold.co/600x400",
      badge: "New",
      rating: 4.5,
      reviews: 45,
    },
    {
      id: 4,
      name: "🍩 Glazed Donut",
      description: "Classic glazed donut with a sweet finish",
      price: 2.99,
      category: "Donuts",
      image: "https://placehold.co/600x400",
      rating: 4.6,
      reviews: 210,
    },
    {
      id: 5,
      name: "🍩 Chocolate Donut",
      description: "Rich chocolate donut with sprinkles",
      price: 3.49,
      category: "Donuts",
      image: "https://placehold.co/600x400",
      badge: "Bestseller",
      rating: 4.9,
      reviews: 187,
    },
    {
      id: 6,
      name: "🍪 Chocolate Chip Cookie",
      description: "Classic cookie with chocolate chips",
      price: 1.99,
      category: "Cookies",
      image: "https://placehold.co/600x400",
      rating: 4.7,
      reviews: 156,
    },
    {
      id: 7,
      name: "🍪 Oatmeal Raisin Cookie",
      description: "Hearty oatmeal cookie with raisins",
      price: 1.89,
      category: "Cookies",
      image: "https://placehold.co/600x400",
      rating: 4.3,
      reviews: 89,
    },
    {
      id: 8,
      name: "🧁 Vanilla Cupcake",
      description: "Light vanilla cupcake with buttercream frosting",
      price: 3.99,
      category: "Cupcakes",
      image: "https://placehold.co/600x400",
      rating: 4.6,
      reviews: 112,
    },
    {
      id: 9,
      name: "🧁 Red Velvet Cupcake",
      description: "Classic red velvet with cream cheese frosting",
      price: 4.49,
      category: "Cupcakes",
      image: "https://placehold.co/600x400",
      badge: "Limited",
      rating: 4.8,
      reviews: 134,
    },
  ])

  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50 })
  const [filteredProducts, setFilteredProducts] = useState([])

  // Extract unique categories from products
  useEffect(() => {
    const uniqueCategories = ["All", ...new Set(products.map((product) => product.category))]
    setCategories(uniqueCategories)
  }, [products])

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products]

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((product) => product.category === selectedCategory)
    }

    // Filter by price range
    result = result.filter((product) => product.price >= priceRange.min && product.price <= priceRange.max)

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        // In a real app, you would sort by date added
        result.sort((a, b) => (a.badge === "New" ? -1 : b.badge === "New" ? 1 : 0))
        break
      default:
        // Featured - no specific sorting, or you could have a "featured" flag in your data
        break
    }

    setFilteredProducts(result)
  }, [products, selectedCategory, sortBy, priceRange])

  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id)

    if (existingItem) {
      setCartItems(cartItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }])
    }

    alert(`${product.name} added to cart!`)
  }

  const addToWishlist = (product) => {
    const isAlreadyInWishlist = wishlistItems.some((item) => item.id === product.id)

    if (isAlreadyInWishlist) {
      // Remove from wishlist
      setWishlistItems(wishlistItems.filter((item) => item.id !== product.id))
      alert(`${product.name} removed from wishlist!`)
    } else {
      // Add to wishlist
      setWishlistItems([...wishlistItems, product])
      alert(`${product.name} added to wishlist!`)
    }
  }

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    if (window.innerWidth < 768) {
      setShowFilters(false)
    }
  }

  const handlePriceChange = (e, type) => {
    const value = Number.parseFloat(e.target.value)
    setPriceRange((prev) => ({ ...prev, [type]: value }))
  }

  return (
    <div className="products-page">
      <Header
        cartItemCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
        wishlistItemCount={wishlistItems.length}
      />

      <div className="products-container">
        <div className="products-header">
          <h1>Our Delicious Desserts</h1>
          <p>Explore our wide range of freshly baked treats</p>
        </div>

        <div className="products-content">
          {/* Mobile Filter Toggle */}
          <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? <FaTimes /> : <FaFilter />} {showFilters ? "Close Filters" : "Filters"}
          </button>

          {/* Filters Sidebar */}
          <aside className={`filters-sidebar ${showFilters ? "show" : ""}`}>
            <div className="filter-section">
              <h3>Categories</h3>
              <ul className="category-list">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      className={selectedCategory === category ? "active" : ""}
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-section">
              <h3>Price Range</h3>
              <div className="price-inputs">
                <div className="price-input">
                  <label htmlFor="min-price">Min ($)</label>
                  <input
                    type="number"
                    id="min-price"
                    min="0"
                    max={priceRange.max}
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange(e, "min")}
                  />
                </div>
                <div className="price-input">
                  <label htmlFor="max-price">Max ($)</label>
                  <input
                    type="number"
                    id="max-price"
                    min={priceRange.min}
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange(e, "max")}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="products-main">
            <div className="products-toolbar">
              <div className="products-count">
                {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
              </div>
              <div className="sort-dropdown">
                <label htmlFor="sort-select">
                  <FaSortAmountDown /> Sort by:
                </label>
                <select id="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>No products found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("All")
                    setPriceRange({ min: 0, max: 50 })
                    setSortBy("featured")
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <div className="product-card" key={product.id}>
                    <div className="product-image-container">
                      <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-image" />
                      {product.badge && <span className="product-badge">{product.badge}</span>}
                      <button
                        className={`wishlist-button ${isInWishlist(product.id) ? "active" : ""}`}
                        onClick={() => addToWishlist(product)}
                        aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <FaHeart />
                      </button>
                    </div>
                    <div className="product-details">
                      <div className="product-category">{product.category}</div>
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      <div className="product-rating">
                        <div className="stars" style={{ "--rating": product.rating }}></div>
                        <span className="rating-count">({product.reviews})</span>
                      </div>
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
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ProductsPage