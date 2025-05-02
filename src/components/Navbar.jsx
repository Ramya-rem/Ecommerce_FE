import { Link } from 'react-router-dom';
import { Home, ShoppingCart, Heart, Package, LogOut } from 'lucide-react';
import logo from '../assets/crave&conquer.logo.png'; // adjust the path based on your folder structure

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="Cakebites Logo" className="w-10 h-10 object-contain" />
          <span className="text-xl font-bold text-gray-800"></span>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-6 text-gray-700 text-sm font-medium">
          <Link to="/home" className="flex items-center gap-1 hover:text-pink-600">
            <Home size={18} /> Home
          </Link>
          <Link to="/shop" className="flex items-center gap-1 hover:text-pink-600">
            <ShoppingCart size={18} /> Shop
          </Link>
          <Link to="/wishlist" className="flex items-center gap-1 hover:text-pink-600">
            <Heart size={18} /> Wishlist
          </Link>
          <Link to="/orders" className="flex items-center gap-1 hover:text-pink-600">
            <Package size={18} /> Orders
          </Link>
          <button className="flex items-center gap-1 px-3 py-1 bg-pink-500 hover:bg-pink-600 text-white rounded-md">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
