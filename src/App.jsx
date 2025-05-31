import './App.css'
import Homepage from './pages/home/HomePage'
import Signup from './pages/signup/Signup'
import Login from './pages/login/Login'
import ForgotPassword from './pages/forgotpassword/ForgotPassword'
import ResetPassword from './pages/forgotpassword/ResetPassword'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import WishlistPage from './pages/wishlist/WishlistPage'
import CartPage from './pages/cart/CartPage'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/home" element={<Homepage />} />
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetPassword/:token" element={<ResetPassword />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />


        </Routes>
      </div>
    </Router>
  )
}

export default App
