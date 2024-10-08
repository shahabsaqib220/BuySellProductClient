import React, { useEffect, useState } from 'react';
import { Disclosure, Menu } from '@headlessui/react';

import { FaCartArrowDown } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { NavLink, useNavigate } from 'react-router-dom';
import useAxiosInstance from '../../ContextAPI/AxiosInstance';

import { useAuth } from '../../ContextAPI/AuthContext'; // Assuming you have an AuthContext for managing auth state

const Navbar = () => {
  const { isLoggedIn, logout, token } = useAuth(); // Getting auth state and token from context
  const [profileImage, setProfileImage] = useState(null); // State to store profile image URL
  const navigate = useNavigate(); // Hook for navigation
  const [cartItemCount, setCartItemCount] = useState(0); 
  const [isBadgeVisible, setIsBadgeVisible] = useState(false); 
  const axiosInstance = useAxiosInstance(); 

  // Define navigation array for mobile menu
 

  // Utility function to conditionally apply class names
  const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };

  useEffect(() => {
    // Fetch profile image if user is logged in
    const fetchProfileImage = async () => {
      if (isLoggedIn && token) {
        try {
          // Use axiosInstance for API call
          const response = await axiosInstance.get('/profile-image/profile-image');
  
          if (response.status === 200) {
            const data = response.data;
            setProfileImage(data.profileImageUrl); // Store the profile image URL in state
          } else {
            console.error('Failed to fetch profile image:', response.data.message);
          }
        } catch (error) {
          console.error('Error fetching profile image:', error);
        }
      }
    };
  
    fetchProfileImage();
  }, [isLoggedIn, token, axiosInstance]); // Include axiosInstance in the dependency array
  


  // const intervalId = setInterval(() => {
  //   if (isLoggedIn) {
  //     fetchCartItemCount();
  //   }
  // }, 5000);

  const fetchCartItemCount = async () => {
    try {
      // Use axiosInstance for the API request
      const response = await axiosInstance.get('/usercart/item/cart');
      
      if (response.status === 200) {
        const data = response.data;
        setCartItemCount(data.length); // Assuming data contains the cart items array
      } else {
        console.error('Error fetching cart items:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };
  

  // Function to handle cart icon click
  const handleCartClick = () => {
    if (isLoggedIn) {
      setIsBadgeVisible(false);
      navigate('/cart');
    } else {
      navigate('/login');
    }
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open: isOpen }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Logo */}
              <div className="flex-shrink-0">
                <NavLink to="/">
                  <h3 className="text-white text-lg font-bold">Logo</h3>
                </NavLink>
              </div>

              {/* Search Bar */}
              <div className="flex-1 flex justify-center px-2">
                <div className="relative w-full max-w-lg flex items-center">
                  <input
                    type="search"
                    className="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search"
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-2.5 mt-1 flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg p-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35M10.5 18A7.5 7.5 0 1 0 10.5 3a7.5 7.5 0 0 0 0 15z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Profile and Cart Icon - for desktop */}
              <div className="hidden sm:flex items-center space-x-4">
                {!isLoggedIn ? (
                  <NavLink to="/login">
                    <button
                      type="button"
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-lg"
                    >
                      Sign In
                    </button>
                  </NavLink>
                ) : (
                  <>
                    {/* Cart Icon */}
                    <div className="relative">
                      <FaCartArrowDown
                        onClick={handleCartClick}
                        className="text-white w-8 h-8 cursor-pointer text-yellow-400"
                      />
                      {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1">
                          {cartItemCount}
                        </span>
                      )}
                    </div>
                    <Menu as="div" className="relative">
                      <div>
                        <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none">
                          {profileImage ? (
                            <img
                              src={profileImage}
                              alt="Profile"
                              className="h-10 w-10 rounded-full object-cover"
                              style={{ aspectRatio: "1/1" }}
                            />
                          ) : (
                            <RxAvatar className="text-yellow-500 text-4xl" />
                          )}
                        </Menu.Button>
                      </div>
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          <NavLink to="/profile" className="block px-4 py-2 text-sm text-gray-700">
                            Dashboard
                          </NavLink>
                        </Menu.Item>
                        
                 
                        <Menu.Item>
                          <button
                            onClick={logout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700"
                          >
                            Log Out
                          </button>
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </>
                )}
              </div>

              {/* Mobile menu button, Profile Image, and Cart Icon */}
              <div className="sm:hidden flex items-center space-x-4">
                {/* Cart Icon for mobile */}
                <div className="relative">
                  <FaCartArrowDown 
                    className="text-yellow-500 text-3xl cursor-pointer"
                    onClick={handleCartClick}
                  />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1">
                      {cartItemCount}
                    </span>
                  )}
                </div>

                {/* Profile Image for mobile */}
                {isLoggedIn && (
                  <Menu as="div" className="relative">
                    <div>
                      <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <RxAvatar className="text-yellow-500 text-3xl" />
                        )}
                      </Menu.Button>
                    </div>
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        <NavLink to="/profile" className="block px-4 py-2 text-sm text-gray-700">
                          Your Profile
                        </NavLink>
                      </Menu.Item>
                      <Menu.Item>
                        <NavLink to="/postad" className="block px-4 py-2 text-sm text-gray-700">
                          Post Ad
                        </NavLink>
                      </Menu.Item>
                      <Menu.Item>
                        <NavLink to="/viewads" className="block px-4 py-2 text-sm text-gray-700">
                          View Posted Ads
                        </NavLink>
                      </Menu.Item>
                      <Menu.Item>
                        <NavLink to="/soldoutproducts" className="block px-4 py-2 text-sm text-gray-700">
                          Your soldout products
                        </NavLink>
                      </Menu.Item>
                      <Menu.Item>
                        <button
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700"
                        >
                          Sign out
                        </button>
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
