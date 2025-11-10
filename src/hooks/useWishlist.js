import { useState, useEffect, useCallback } from "react"
import api from "../utils/api"

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([])
  const [wishlistCount, setWishlistCount] = useState(0)
  const [loading, setLoading] = useState(false)

  // Fetch wishlist from backend
  const fetchWishlist = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get("/getUserWishlist")
      if (response.data.success) {
        setWishlistItems(response.data.wishlistItems || [])
        setWishlistCount(response.data.wishlistCount || 0)
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      // If user is not authenticated, set empty wishlist
      if (error.response?.status === 401) {
        setWishlistItems([])
        setWishlistCount(0)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch wishlist on mount
  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  // Check if a product is in wishlist
  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some((item) => item.id === productId || item._id === productId)
  }, [wishlistItems])

  // Add product to wishlist
  const addToWishlist = useCallback(async (product) => {
    try {
      const productId = product._id || product.id
      const response = await api.post("/addTo-wishlist", { productId })
      
      if (response.status === 200) {
        // Refresh wishlist after adding
        await fetchWishlist()
        return { success: true, message: "Product added to wishlist" }
      }
      return { success: false, message: "Failed to add to wishlist" }
    } catch (error) {
      console.error("Error adding to wishlist:", error)
      const message = error.response?.data?.message || "Failed to add to wishlist"
      return { success: false, message }
    }
  }, [fetchWishlist])

  // Remove product from wishlist
  const removeFromWishlist = useCallback(async (productId) => {
    try {
      const response = await api.delete("/delete-wishlist", {
        data: { productId }
      })
      
      if (response.status === 200) {
        // Refresh wishlist after removing
        await fetchWishlist()
        return { success: true, message: "Product removed from wishlist" }
      }
      return { success: false, message: "Failed to remove from wishlist" }
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      const message = error.response?.data?.message || "Failed to remove from wishlist"
      return { success: false, message }
    }
  }, [fetchWishlist])

  // Toggle product in wishlist (add if not present, remove if present)
  const toggleWishlist = useCallback(async (product) => {
    const productId = product._id || product.id
    const inWishlist = isInWishlist(productId)
    
    if (inWishlist) {
      return await removeFromWishlist(productId)
    } else {
      return await addToWishlist(product)
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist])

  return {
    wishlistItems,
    wishlistCount,
    loading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    refreshWishlist: fetchWishlist
  }
}

