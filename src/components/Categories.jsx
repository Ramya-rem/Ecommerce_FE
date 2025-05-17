import React from 'react'
import "../styles/Categories.css"

const Categories = () => {
    const categories = [
        { emoji: "🍰", name: "Cakes" },
        { emoji: "🍩", name: "Donuts" },
        { emoji: "🍪", name: "Cookies" },
        { emoji: "🧁", name: "Cupcakes" },
      ]
  return (
    <section className="categories">
      <div className="categories-container">
        {categories.map((category, index) => (
          <a href="#" className="category-item" key={index}>
            <span className="category-emoji">{category.emoji}</span>
            <span className="category-name">{category.name}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default Categories
