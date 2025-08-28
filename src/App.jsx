import './App.css'
import Homepage from './pages/home/HomePage'
import Signup from './pages/signup/Signup'
import Login from './pages/login/Login'
import ForgotPassword from './pages/forgotpassword/ForgotPassword'
import ResetPassword from './pages/forgotpassword/ResetPassword'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import WishlistPage from './pages/wishlist/WishlistPage'
import CartPage from './pages/cart/CartPage'
import CheckoutPage from './pages/checkout/CheckoutPage'
import OrderConfirmationPage from './pages/checkout/OrderConfirmationPage'
import { useEffect, useState } from 'react'
import ProductsPage from './pages/products/productPage'
import OrdersPage from './pages/orders/OrdersPage'

function App() {
   const [forceRender, setForceRender] = useState(false)

  useEffect(() => {
    // Force a re-render after component mounts
    setForceRender(true)
  }, [])

  return (
     <Router>
      <div className={`app-container ${forceRender ? "rendered" : ""}`}>
        <Routes>
          <Route path="/home" element={<Homepage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderConfirmationPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetPassword/:token" element={<ResetPassword />} />
          <Route path='/products' element={<ProductsPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
