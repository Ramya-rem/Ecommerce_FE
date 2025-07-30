import { FaHeart, FaShoppingCart } from "react-icons/fa";
import "../styles/FeaturedDesserts.css";
import { useEffect, useState } from "react";
import api from "../utils/api";

function FeaturedDesserts({ addToCart, addToWishlist, wishlistItems }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDesserts = async () => {
      try {
        const res = await api.get("/getallProduct?category=desserts"); // Adjust if your endpoint is different
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch desserts", err);
      }
    };

    fetchDesserts();
  }, []);

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const handleWishlistToggle = async (product) => {
    setLoading(true);
    try {
      const isAlreadyInWishlist = wishlistItems.some(
        (item) => item.id === product._id
      );

      if (isAlreadyInWishlist) {
        // Remove from wishlist
        const response = await api.delete("/delete-wishlist", {
          data: { productId: product._id }
        });
        
        if (response.status === 200) {
          addToWishlist(wishlistItems.filter((item) => item.id !== product._id));
          alert(`${product.productName} removed from wishlist!`);
        }
      } else {
        // Add to wishlist
        const response = await api.post("/addTo-wishlist", {
          productId: product._id
        });
        
        if (response.status === 200) {
          addToWishlist([...wishlistItems, response.data.addedProduct]);
          alert(`${product.productName} added to wishlist!`);
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

  return (
    <section className="featured-desserts">
      <div className="featured-container">
        <h2>Featured Desserts</h2>
        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <div className="product-image-container">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${product.image}`}
                  alt={product.productName}
                  className="product-image"
                />
                {product.badge && (
                  <span className="product-badge">{product.badge}</span>
                )}
                <button
                  className={`wishlist-button ${
                    isInWishlist(product._id) ? "active" : ""
                  } ${loading ? "loading" : ""}`}
                  onClick={() => handleWishlistToggle(product)}
                  disabled={loading}
                  title={
                    isInWishlist(product._id)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  <FaHeart />
                </button>
              </div>
              <div className="product-details">
                <div className="product-header">
                  <h3>{product.productName}</h3>
                </div>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                  >
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
  );
}

export default FeaturedDesserts;
