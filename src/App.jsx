import { useState } from 'react'
import './App.css'
import Homepage from './pages/home/HomePage'
import Signup from './pages/signup/Signup'
import Login from './pages/login/Login'
import ForgotPassword from './pages/forgotpassword/ForgotPassword'
import ResetPassword from './pages/forgotpassword/ResetPassword'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
console.log("App rendered");
  return (
    <Router>
    <Routes>
    <Route path="/" element={<Homepage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/forgotpassword' element={<ForgotPassword />} />
      <Route path='/resetPassword/:token' element={<ResetPassword />} />


    </Routes>
  </Router>  
  )
}

export default App
