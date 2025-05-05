import React from 'react'

const Navbar = () => {
  console.log("nav is rendered")
  return (
      <nav className="bg-white py-4 px-6 shadow-md">
        <div className="flex space-x-16 justify-center">
          <a href="#" className="text-lg font-medium text-gray-800 hover:text-primary">
            Cakes
          </a>
          <a href="#" className="text-lg font-medium text-gray-800 hover:text-primary">
            Donuts
          </a>
          <a href="#" className="text-lg font-medium text-gray-800 hover:text-primary">
            Desserts
          </a>
          <a href="#" className="text-lg font-medium text-gray-800 hover:text-primary">
            Drinks
          </a>
        </div>
      </nav>
  )
}

export default Navbar
