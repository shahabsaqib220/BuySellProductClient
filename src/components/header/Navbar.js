import React, { useEffect, useState } from 'react';
import { Disclosure, Menu } from '@headlessui/react';
import { FaCartArrowDown } from 'react-icons/fa';
import { RxAvatar } from 'react-icons/rx';
import { NavLink, useNavigate } from 'react-router-dom';
import {  useSelector } from 'react-redux';
import useAxiosInstance from '../../ContextAPI/AxiosInstance';
import { useDispatch } from 'react-redux';
import { setUserAndAd } from '../../Redux/usersChatSlice';
import { useAuth } from '../../ContextAPI/AuthContext'; 
import { TbMessageFilled } from "react-icons/tb";// Assuming you have an AuthContext for managing auth state

const Navbar = () => {
  const { isLoggedIn, logout, token } = useAuth(); 
  const dispatch = useDispatch();// Getting auth state and token from context
  const [profileImage, setProfileImage] = useState(null); // State to store profile image URL
  const navigate = useNavigate(); // Hook for navigation
  const [cartItemCount, setCartItemCount] = useState(0);
  const user = useSelector((state) => state.user.user);
  const axiosInstance = useAxiosInstance();
  const ad = useSelector((state) => state.user.ad);

  // Utility function to conditionally apply class names
  const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };


  const intervalId = setInterval(() => {
     if (isLoggedIn) {
       fetchCartItemCount();
     }
   }, 5000);
  

  const userId = user ? user.id : null;

  useEffect(() => {
    // Fetch profile image if user is logged in
    const fetchProfileImage = async () => {
      if (isLoggedIn && token) {
        try {
          const response = await axiosInstance.get('/userlogin/profile-image');

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
  }, [isLoggedIn, token, axiosInstance]);

  const fetchCartItemCount = async () => {
    try {
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
      navigate('/cart');
    } else {
      navigate('/login');
    }
  };

  const handleChatClick = () =>{
    if (isLoggedIn){
     
     

      
  
     
      navigate(`/chat`)
      console.log(ad)
    }
    else{
      navigate("/login")
    }
  }

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
                      <button
                        onClick={handleCartClick}
                        className="text-black font-semibold py-2 px-4 rounded-lg"
                      >
                        <FaCartArrowDown className=" text-yellow-500  w-8 h-8" />
                        
                      </button>
                      {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1">
                          {cartItemCount}
                        </span>
                        
                        
                      )}
                        <button
                        onClick={handleChatClick}
                        className="text-black font-semibold py-2 px-4 rounded-lg"
                      >
                        <TbMessageFilled className=" text-yellow-500  w-8 h-8" />
                        
                      </button>




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

              {/* Mobile menu button */}
              <div className="sm:hidden flex items-center space-x-4">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {isOpen ? (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16m-7 6h7"
                      />
                    </svg>
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {!isLoggedIn ? (
                <NavLink to="/login">
                  <button
                    type="button"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold w-full py-2 px-4 rounded-lg"
                  >
                    Sign In
                  </button>
                </NavLink>
              ) : (
                <>
                  {/* Cart Icon for mobile */}
                  <div className="relative mb-2">
                    <button
                      onClick={handleCartClick}
                      className="flex items-center justify-center w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-lg text-left"
                    >
                      <FaCartArrowDown className="text-white mr-2" />
                      <span>Cart</span>
                    </button>
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1">
                        {cartItemCount}
                      </span>
                    )}
                  </div>
                  <NavLink to="/profile">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold w-full py-2 px-4 rounded-lg">
                      Dashboard
                    </button>
                  </NavLink>
                  <button
                    onClick={logout}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold w-full py-2 px-4 rounded-lg"
                  >
                    Log Out
                  </button>
                </>
              )}
            </div>
          </Disclosure.Panel>
          {/* <div>
            <h1 className='bg-red-500'>User Information</h1>
            {userId ? (
                <p>User ID: {userId}</p>
            ) : (
                <p>No user is logged in.</p>
            )}
        </div> */}
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
