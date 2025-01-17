import React, { useState } from "react";
import { RiLogoutBoxLine } from "react-icons/ri";
import { useAuth } from "../ContextAPI/AuthContext";
import { NavLink } from "react-router-dom";

const UserNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo Section */}
          <div className="flex items-center">
            <a href="#" className="text-xl font-bold text-gray-800">
              Sell Any Product
            </a>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex space-x-8">
          <NavLink
  to="/profile"
  className={({ isActive }) =>
    isActive
      ? "text-yellow-500 bg-gray-700 font-semibold px-4 py-2 rounded-lg transition duration-200 ease-in-out hover:bg-gray-600"
      : "text-yellow-100 bg-yellow-500 font-semibold px-4 py-2 rounded-lg transition duration-200 ease-in-out hover:text-black hover:bg-yellow-500"
  }
>
  Profile
</NavLink>

            <NavLink
              to="/postad"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-500 bg-gray-700 font-semibold px-4 py-2 rounded-lg transition duration-200 ease-in-out hover:bg-gray-600"
                  : "text-yellow-100 bg-yellow-500 font-semibold px-4 py-2 rounded-lg transition duration-200 ease-in-out hover:text-black hover:bg-yellow-500"
              }
            >
              Post Ad
            </NavLink>
            <NavLink
              to="/viewads"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-500 bg-gray-700 font-semibold px-4 py-2 rounded-lg transition duration-200 ease-in-out hover:bg-gray-600"
                  : "text-yellow-100 bg-yellow-500 font-semibold px-4 py-2 rounded-lg transition duration-200 ease-in-out hover:text-black hover:bg-yellow-500"
              }
            >
              Posted Ads
            </NavLink>
            <NavLink
              to="/soldoutproducts"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-500 bg-gray-700 font-semibold px-4 py-2 rounded-lg transition duration-200 ease-in-out hover:bg-gray-600"
                  : "text-yellow-100 bg-yellow-500 font-semibold px-4 py-2 rounded-lg transition duration-200 ease-in-out hover:text-black hover:bg-yellow-500"
              }
            >
              Sold Products
            </NavLink>
            <NavLink
              to="/security"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-500 bg-gray-700 font-semibold px-4 py-2 rounded-lg transition duration-200 ease-in-out hover:bg-gray-600"
                  : "text-yellow-100 bg-yellow-500 font-semibold px-4 py-2 rounded-lg transition duration-200 ease-in-out hover:text-black hover:bg-yellow-500"
              }
            >
              Security
            </NavLink>
            <button
              onClick={logout}
              className="text-white space-x-4 bg-yellow-500 hover:bg-red-500 font-medium rounded-lg px-4 py-2"
            >
              Log Out
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <ul className="flex flex-col items-center space-y-4 py-4">
            <NavLink
              to="/profile"
              className="text-yellow-00 bg-yellow-500 font-semibold px-4 py-2 rounded-lg transition duration-200 ease-in-out hover:text-black hover:bg-yellow-500"
            >
              Profile
            </NavLink>
            <NavLink
              to="/postad"
              className="text-yellow-00 bg-yellow-500 font-semibold px-4 py-2 rounded-lg transition duration-200 ease-in-out hover:text-black hover:bg-yellow-500"
            >
              Post Ad
            </NavLink>
            <NavLink
              to="/viewads"
              className="text-yellow-00 bg-yellow-500 font-semibold px-4 py-2 rounded-lg transition duration-200 ease-in-out hover:text-black hover:bg-yellow-500"
            >
              Posted Ads
            </NavLink>
            <NavLink
              to="/soldoutproducts"
              className="text-yellow-00 bg-yellow-500 font-semibold px-4 py-2 rounded-lg transition duration-200 ease-in-out hover:text-black hover:bg-yellow-500"
            >
              Sold Products
            </NavLink>
            <NavLink
              to="/security"
              className="text-yellow-00 bg-yellow-500 font-semibold px-4 py-2 rounded-lg transition duration-200 ease-in-out hover:text-black hover:bg-yellow-500"
            >
              Security
            </NavLink>
            <button
              onClick={logout}
              className="text-white bg-yellow-500 hover:bg-yellow-600 font-medium rounded-lg px-4 py-2"
            >
              Log Out
            </button>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
