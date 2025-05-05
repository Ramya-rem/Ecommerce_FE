import React from 'react'

const CategorySection = () => {
    const categories = [
        { name: "Cakes", icon: "/images/cheesecake.png" },
        { name: "Donuts", icon: "/images/Chocolatetruflecake.png" },
        { name: "Desserts", icon: "/images/browniewithicecream.png" },
        { name: "Drinks", icon: "/images/herosection-ecom.webp" },
      ]
  return (
    <div className="py-12 px-6">
      <div className="flex flex-wrap justify-center gap-8">
        {categories.map((category, index) => (
          <div key={index} className="text-center">
            <div className="bg-[#fff5e6] rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <img src={category.icon || "/images/herosection-ecom.webp"} alt={category.name} className="w-16 h-16" />
            </div>
            <h3 className="text-xl font-medium">{category.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategorySection
