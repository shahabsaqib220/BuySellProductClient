import React, { useState } from 'react';
import { RiLogoutBoxLine } from "react-icons/ri";
import { useAuth } from '../ContextAPI/AuthContext';
import { NavLink } from 'react-router-dom';

const UserNavbar = () => {
  // State to manage the open/close state of the hamburger menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {  logout } = useAuth(); 

  // Function to toggle the menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-600 dark:bg-gray-900 w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3">
          <img className="h-8" />
          <span className="self-center text-2xl font-semibold"></span>
        </a>
        
        {/* Hamburger Icon */}
        <div className="flex md:hidden">
          <button
            onClick={toggleMenu}
            className="inline-flex items-center bg-yellow-500 p-2 w-10 h-10 justify-center text-black rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className={`w-full md:w-auto md:flex  md:items-center ${isMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col md:flex-row md:space-x-8 p-4 md:p-0 mt-4 md:mt-0 md:bg-transparent border border-yellow-200 rounded-lg md:border-none dark:bg-yellow-800 md:dark:bg-transparent">
            <li>
              <NavLink to="/profile" className="block py-2 px-3 font-semibold bg-yellow-400 lg:text-black lg:hover:bg-yellow-500 rounded sm:bg-yellow-500 sm:text-red-500 sm:font-semibold  ">
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink to="/postad" className="block py-2 px-3 font-semibold bg-yellow-400 lg:text-black lg:hover:bg-yellow-500 rounded sm:bg-yellow-500 sm:text-red-500 sm:font-semibold  ">
                Post Ad
              </NavLink>
            </li>
            <li>
              <NavLink to="/viewads" className="block py-2 px-3 font-semibold bg-yellow-400 lg:text-black lg:hover:bg-yellow-500 rounded sm:bg-yellow-500 sm:text-red-500 sm:font-semibold  ">
                Posted Ads
              </NavLink>
            </li>
            <li>
              <NavLink to="/soldoutproducts" className="block py-2 px-3 font-semibold bg-yellow-400 lg:text-black lg:hover:bg-yellow-500 rounded sm:bg-yellow-500 sm:text-red-500 sm:font-semibold ">
                Sold Products
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Get Started Button */}
        <div className="hidden md:flex items-center space-x-3">
          <button type="button" onClick={logout} className=" flex text-black font-semibold bg-yellow-500  focus:ring-4 focus:outline-none focus:ring-yellow-200 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <RiLogoutBoxLine className='text-xl mx-1' /> Log Out 
          </button>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
