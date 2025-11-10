const API_BASE_URL = import.meta.env.VITE_BASE_URL

export const fetchAllProducts = async (category = null) => {
  try {
    const url = category
      ? `${API_BASE_URL}/getallProduct?category=${category}`
      : `${API_BASE_URL}/getallProduct`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export const fetchProductsByCategory = async (category) => {
  return fetchAllProducts(category)
}
