import React, { useState } from 'react';
import { RiLogoutBoxLine } from "react-icons/ri";
import { useAuth } from '../ContextAPI/AuthContext';
import { NavLink } from 'react-router-dom';

const UserNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth(); 

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-200 border-gray-200 py-2.5">
      <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
        {/* Logo Section */}
        <a href="#" className="flex items-center">
          <span className="self-center text-xl font-semibold whitespace-nowrap">
            Sell Any Product
          </span>
        </a>

        {/* Desktop Menu & Hamburger */}
        <div className="flex items-center lg:order-2">
          {/* Logout Button */}
          <button
            onClick={logout}
            className="hidden text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-400 font-semibold rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 focus:outline-none lg:inline-block"
          >
            Log Out
          </button>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
            aria-controls="mobile-menu-2"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
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

        {/* Mobile Menu */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } items-center justify-between w-full lg:flex lg:w-auto lg:order-1`}
          id="mobile-menu-2"
        >
          <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? "block py-2 pl-3 pr-4 text-yellow-500 font-bold lg:text-yellow-500 lg:p-0"
                    : "block py-2 pl-3 pr-4 text-gray-700 lg:hover:text-yellow-500 lg:p-0 "
                }
                aria-current="page"
              >
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/postad"
                className={({ isActive }) =>
                  isActive
                    ? "block py-2 pl-3 pr-4 text-yellow-500 font-bold lg:text-yellow-500 lg:p-0"
                    : "block py-2 pl-3 pr-4 text-gray-700 lg:hover:text-yellow-500 lg:p-0 "
                }
              >
                Post Ad
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/viewads"
                className={({ isActive }) =>
                  isActive
                    ? "block py-2 pl-3 pr-4 text-yellow-500 font-bold lg:text-yellow-500 lg:p-0"
                    : "block py-2 pl-3 pr-4 text-gray-700 lg:hover:text-yellow-500 lg:p-0 "
                }
              >
                Posted Ads
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/soldoutproducts"
                className={({ isActive }) =>
                  isActive
                    ? "block py-2 pl-3 pr-4 text-yellow-500 font-bold lg:text-yellow-500 lg:p-0"
                    : "block py-2 pl-3 pr-4 text-gray-700 lg:hover:text-yellow-500 lg:p-0 "
                }
              >
                Sold Products
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/security"
                className={({ isActive }) =>
                  isActive
                    ? "block py-2 pl-3 pr-4 text-yellow-500 font-bold lg:text-yellow-500 lg:p-0"
                    : "block py-2 pl-3 pr-4 text-gray-700 lg:hover:text-yellow-500 lg:p-0"
                }
              >
                Security
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      {/* Logout Button for Small Devices */}
      {isMenuOpen && (
        <div className="block lg:hidden">
          <button
            onClick={logout}
            className="w-full text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 font-medium rounded-lg text-sm px-4 py-2.5 mt-4  focus:outline-none "
          >
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
