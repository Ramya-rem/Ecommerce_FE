import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { fetchAllProducts } from "../utils/ProductApi"
import "../styles/Categories.css"

function Categories() {
  const [categoriesData, setCategoriesData] = useState([
    { emoji: "🍰", name: "Cakes", link: "/products?category=Cakes", apiKey: "cake" },
    { emoji: "🍨", name: "Desserts", link: "/products?category=Desserts", apiKey: "desert" },
    { emoji: "🥤", name: "Drinks", link: "/products?category=Drinks", apiKey: "drink" },
  ])

  // Fetch product counts for each category
  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const updated = await Promise.all(
          categoriesData.map(async (category) => {
            const products = await fetchAllProducts(category.apiKey)
            return { ...category, count: products.length }
          })
        )
        setCategoriesData(updated)
      } catch (error) {
        console.error("Error fetching category counts:", error)
      }
    }

    fetchCategoryCounts()
  }, [])

  return (
    <section className="categories">
      <div className="categories-container">
        {categoriesData.map((category, index) => (
          <Link to={category.link} className="category-item" key={index}>
            <span className="category-emoji">{category.emoji}</span>
            <span className="category-name">{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Categories
