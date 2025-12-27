import { useState, useEffect } from "react";
import {
  FaHeart,
  FaShoppingCart,
  FaFilter,
  FaTimes,
  FaSortAmountDown,
} from "react-icons/fa";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./productPage.css";
import api from "../../utils/api";
import { fetchAllProducts } from "../../utils/ProductApi";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [categories] = useState(["All", "Cakes", "Desserts", "Drinks"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);

  // Map frontend category names to API category values
  const getCategoryFilter = (frontendCategory) => {
    const categoryMap = {
      "All": null,
      "Cakes": "cake",
      "Desserts": "desert",
      "Drinks": "drink"
    };
    return categoryMap[frontendCategory];
  };

  // ✅ Fetch Products from Backend with Category Filter
  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const categoryFilter = getCategoryFilter(selectedCategory);
        const productsData = await fetchAllProducts(categoryFilter);
        
        const mappedProducts = productsData.map((p) => ({
          id: p._id,
          name: p.productName,
          price: p.price,
          image: p.image,
          category: p.category,
          description: p.description,
          rating: 4.5, // Default rating
          reviews: 50, // Default reviews
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error("Error fetching products", error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  // ✅ Fetch User's Wishlist from Backend
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await api.get("/getUserWishlist");
        if (response.data.success) {
          setWishlistItems(response.data.wishlistItems);
        }
      } catch (error) {
        console.error("Error fetching wishlist", error);
      }
    };
    fetchWishlist();
  }, []);

  // ✅ Fetch User's Cart from Backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get("/getUsercart");
        if (response.data.success) {
          setCartItems(response.data.cartItems);
        }
      } catch (error) {
        console.error("Error fetching cart", error);
      }
    };
    fetchCart();
  }, []);

  // ✅ Apply Filters & Sorting (Backend handles category filtering, only apply price and sort here)
  useEffect(() => {
    let result = [...products];

    // Backend already filters by category, so we only need to filter by price range
    result = result.filter(
      (product) =>
        product.price >= priceRange.min && product.price <= priceRange.max
    );

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) =>
          a.badge === "New" ? -1 : b.badge === "New" ? 1 : 0
        );
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [products, sortBy, priceRange]);

  const addToCart = async (product) => {
    setCartLoading(true);
    try {
      const response = await api.post("/addtocart", {
        productId: product.id,
        quantity: 1
      });
      
      if (response.status === 200) {
        // Refresh cart data from backend
        const cartResponse = await api.get("/getUsercart");
        if (cartResponse.data.success) {
          setCartItems(cartResponse.data.cartItems);
        }
        alert(`${product.name} added to cart!`);
      }
    } catch (error) {
      console.error("Add to cart failed:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to add item to cart. Please try again.");
      }
    } finally {
      setCartLoading(false);
    }
  };

  const addToWishlist = async (product) => {
    setLoading(true);
    try {
      const isAlreadyInWishlist = wishlistItems.some(
        (item) => item.id === product.id
      );

      if (isAlreadyInWishlist) {
        // Remove from wishlist
        const response = await api.delete("/delete-wishlist", {
          data: { productId: product.id }
        });
        
        if (response.status === 200) {
          setWishlistItems(wishlistItems.filter((item) => item.id !== product.id));
          alert(`${product.name} removed from wishlist!`);
        }
      } else {
        // Add to wishlist
        const response = await api.post("/addTo-wishlist", {
          productId: product.id
        });
        
        if (response.status === 200) {
          setWishlistItems([...wishlistItems, response.data.addedProduct]);
          alert(`${product.name} added to wishlist!`);
        }
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to update wishlist. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (window.innerWidth < 768) {
      setShowFilters(false);
    }
  };

  const handlePriceChange = (e, type) => {
    const value = parseFloat(e.target.value);
    setPriceRange((prev) => ({ ...prev, [type]: value }));
  };

  return (
    <div className="products-page">
      <Header
        cartItemCount={cartItems.reduce(
          (total, item) => total + item.quantity,
          0
        )}
        wishlistItemCount={wishlistItems.length}
      />

      <div className="products-container">
        <div className="products-header">
          <h1>Our Delicious Desserts</h1>
          <p>Explore our wide range of freshly baked treats</p>
        </div>

        <div className="products-content">
          {/* Mobile Filter Toggle */}
          <button
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? <FaTimes /> : <FaFilter />}{" "}
            {showFilters ? "Close Filters" : "Filters"}
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
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
              </div>
              <div className="sort-dropdown">
                <label htmlFor="sort-select">
                  <FaSortAmountDown /> Sort by:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
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
                    setSelectedCategory("All");
                    setPriceRange({ min: 0, max: 1000 });
                    setSortBy("featured");
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
                      <img
                        src={`${import.meta.env.VITE_BASE_URL}${product.image}`}
                        alt={product.name}
                        className="product-image"
                      />

                      <button
                        className={`wishlist-button ${
                          isInWishlist(product.id) ? "active" : ""
                        } ${loading ? "loading" : ""}`}
                        onClick={() => addToWishlist(product)}
                        disabled={loading}
                        aria-label={
                          isInWishlist(product.id)
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >
                        <FaHeart />
                      </button>
                    </div>
                    <div className="product-details">
                      <div className="product-category">{product.category}</div>
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">
                        {product.description}
                      </p>
                      <div className="product-rating">
                        <div
                          className="stars"
                          style={{ "--rating": product.rating }}
                        ></div>
                        <span className="rating-count">
                          ({product.reviews})
                        </span>
                      </div>
                      <div className="product-footer">
                        <span className="product-price">
                          ${product.price.toFixed(2)}
                        </span>
                        <button
                          className="add-to-cart-btn"
                          onClick={() => addToCart(product)}
                          disabled={cartLoading}
                        >
                          <FaShoppingCart />
                          {cartLoading ? "Adding..." : "Add to Cart"}
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
  );
};

export default ProductsPage;
