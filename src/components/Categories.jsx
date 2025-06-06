import { Link } from "react-router-dom"
import "../styles/Categories.css"

function Categories() {
  const categories = [
    { emoji: "🍰", name: "Cakes", link: "/products" },
    { emoji: "🍩", name: "Donuts", link: "/products" },
    { emoji: "🍪", name: "Cookies", link: "/products" },
    { emoji: "🧁", name: "Cupcakes", link: "/products" },
  ]

  return (
    <section className="categories">
      <div className="categories-container">
        {categories.map((category, index) => (
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
