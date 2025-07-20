import { FaHeart, FaShoppingCart } from "react-icons/fa";
import "../styles/FeaturedDesserts.css";
import { useEffect, useState } from "react";
import api from "../../src/utils/api";

function FeaturedDesserts({ addToCart, addToWishlist, wishlistItems }) {
  const [products, setProducts] = useState([]);

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
    return wishlistItems.some((item) => item._id === productId);
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
              </div>
              <div className="product-details">
                <div className="product-header">
                  <h3>{product.productName}</h3>
                  <button
                    className={`wishlist-button ${
                      isInWishlist(product._id) ? "active" : ""
                    }`}
                    onClick={() => addToWishlist(product)}
                  >
                    <FaHeart />
                  </button>
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
