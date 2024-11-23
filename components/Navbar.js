import React, { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';  // For the Cart icon

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);  // State to manage mobile menu

  return (
    <div className="bg-white text-white p-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <img src="https://www.uniquepipedgas.com/unique.png" alt="Logo" className="h-20 w-64" />

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <a href="/" className="hover:text-blue-800 text-gray-800 hover:font-bold">Home</a>
          <a href="/products" className="hover:text-blue-800 text-gray-800 hover:font-bold">Products</a>
          <a href="/checkout" className="hover:text-blue-800 text-gray-800 hover:font-bold">Reticulated Payments</a>
          <a href="/aboutus" className="hover:text-blue-800 text-gray-800 hover:font-bold">About Us</a>
          <a href="/contactus" className="hover:text-blue-800 text-gray-800 hover:font-bold">Contact Us</a>
        </div>

        {/* Cart Icon with margin-right */}
        <div className="relative flex flex-row gap-8 mr-2"> {/* Added margin-right here */}
          <a href="/Cart">
          <FaShoppingCart className="text-2xl hover:text-blue-800 text-gray-800 hover:font-bold cursor-pointer" />
          {/* Cart badge (optional) */}
          {/* <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">3</span> */}
      
      </a>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-2xl hover:text-blue-800 text-gray-800 hover:font-bold" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? '×' : '☰'}
        </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 space-y-4">
          <a href="/" className="block py-2 px-4 bg-gray-700 rounded hover:bg-gray-600">Home</a>
          <a href="/products" className="block py-2 px-4 bg-gray-700 rounded hover:bg-gray-600">Products</a>
          <a href="/checkout" className="block py-2 px-4 bg-gray-700 rounded hover:bg-gray-600">Reticulated Payments</a>
          <a href="/aboutus" className="block py-2 px-4 bg-gray-700 rounded hover:bg-gray-600">About Us</a>
          <a href="/contactus" className="block py-2 px-4 bg-gray-700 rounded hover:bg-gray-600">Contact Us</a>
        </div>
      )}
    </div>
  );
};

export default Navbar;
