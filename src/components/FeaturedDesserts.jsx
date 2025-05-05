import React from 'react'

const FeaturedDesserts = () => {
    const desserts = [
        {
          id: 1,
          name: "Strawberry Cake",
          image: "/images/browniewithicecream.webp",
          price: "$12.99",
        },
        {
          id: 2,
          name: "Choco Lava",
          image: "/images/Chocolatetruflecake.png",
          price: "$8.99",
        },
        {
          id: 3,
          name: "Coconut",
          image: "/images/cheesecake.png",
          price: "$7.99",
        },
      ]
  return (
    <div className="py-12 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Featured Desserts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {desserts.map((dessert) => (
          <div key={dessert.id} className="bg-gray-100 rounded-lg overflow-hidden">
            <img src={dessert.image || "/placeholder.svg"} alt={dessert.name} className="w-full h-64 object-cover" />
            <div className="p-4 text-center">
              <h3 className="text-xl font-medium mb-2">{dessert.name}</h3>
              <p className="text-gray-700 mb-4">{dessert.price}</p>
              <button className="bg-[#f79d7f] hover:bg-[#f58b67] text-white font-medium py-2 px-6 rounded-full transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeaturedDesserts
