import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom'


const Navbar = () => {

  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const logoStyle = {
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.3)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    padding: '4px'
  };
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 w-full z-10 flex justify-between px-4 md:px-8 py-2 md:py-4 bg-black/60 backdrop-blur-md border-b border-white text-white rounded-b-lg items-center transition-all duration-300 ${
        scrolled ? 'py-1 md:py-2 h-12 md:h-16 shadow-lg' : 'h-16 md:h-20'
      }`}
    >
      <img
        onClick={() => navigate('/')}
        src={logo}
        alt="Logo"
        className={`ml-2 md:ml-16 cursor-pointer transition-all duration-300 ${
          scrolled ? 'h-10 md:h-12' : 'h-16 md:h-20'
        }`}
      />
      <div
        onClick={() => navigate('/Solution')}
        className="font-bold cursor-pointer text-xs md:text-md tracking-tighter flex items-center ml-4 md:ml-8 opacity-0 md:opacity-100"
      >
        <span className="text-green-500">[</span>Its_SAFE <span>WithUs</span>
        <span className="text-green-500">]</span>
      </div>
      <div className="flex gap-2 md:gap-6 text-xs md:text-md">
        <button className="text-gray-400 hover:text-white transition-all cursor-pointer">Login</button>
        <button className="text-gray-400 hover:text-white transition-all cursor-pointer">Cart</button>
        <button className="text-gray-400 hover:text-white transition-all cursor-pointer">About Us</button>
      </div>
      {/* Mobile menu button */}
      <div className="md:hidden ml-2">
        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className="text-white focus:outline-none"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
      {/* Mobile menu */}
      {showMenu && (
        <div className="absolute top-full left-0 w-full bg-black/80 backdrop-blur-md flex flex-col items-center py-4 md:hidden">
          <button className="text-gray-400 hover:text-white transition-all cursor-pointer mb-2">Login</button>
          <button className="text-gray-400 hover:text-white transition-all cursor-pointer mb-2">Cart</button>
          <button className="text-gray-400 hover:text-white transition-all cursor-pointer">About Us</button>
        </div>
      )}
    </div>
  )
}

export default Navbar