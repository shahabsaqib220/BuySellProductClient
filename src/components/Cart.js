import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from 'react-icons/fa';
import { useAuth } from '../ContextAPI/AuthContext';

const CartComponent = () => {
  const { isLoggedIn, token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartItems();
    }
  }, [isLoggedIn]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/usercart/item/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCartItems(data);
      } else {
        console.error("Error fetching cart items:", data.message);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const getFirstThreeWords = (location) => {
    if (!location) return '';
    const words = location.split(' ');
    return words.slice(0, 3).join(' ');
  };

   const handleProductDetailsClick = (adId) => {
    navigate(`/product/${adId}`); // Navigate to product details page
  };


  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-10 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sign in to use your cart</h2>
          <p className="text-gray-500 mb-8">Please log in to add items to your cart and proceed to checkout.</p>
          <NavLink to="/login">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded-lg font-semibold transition duration-300">
              Sign In
            </button>
          </NavLink>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-10 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8">You haven't added any items to your cart yet.</p>
          <NavLink to="/">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded-lg font-semibold transition duration-300">
              Continue Shopping
            </button>
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Shopping Cart</h1>

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-16 h-16">
                        <img
                          className="w-full h-full object-cover rounded-lg"
                          src={item.adDetails.images[0].url}
                          alt={item.adDetails.images[0].alt}
                        />
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-900 font-medium whitespace-no-wrap">{item.adDetails.model}</p>
                      </div>
                    </div>
                
                  
         
  

                     
                   
                  
                  </td>
                      <td className="px-6 py-5 border-b border-gray-200 bg-white text-semibold text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item.adStatus}</p>
                  </td>
                  <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                  <p>{getFirstThreeWords(item.adDetails.location?.readable) || 'Location not specified'}</p>                  </td>

                  <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item.adDetails.condition}</p>
                  </td>
                 
                  <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm">

                    <p className="text-gray-900 whitespace-no-wrap">${(item.adDetails.price).toFixed(2)}</p>
                  </td>

                   <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm font-medium">
                    <button
                      className="text-yellow-500 hover:text-yellow-600"
                      onClick={() => handleProductDetailsClick(item._id)} // Add navigation on click
                    >
                      Product Details
                    </button>
                    
                  </td>



                 
                  <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <button
                      className="text-red-500 hover:text-red-700 transition duration-200"
                      // onClick={() => removeFromCart(item.id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Summary */}
        <div className="flex flex-col md:flex-row justify-between mt-8">
          <div className="w-full md:w-1/3">
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  ${calculateSubtotal(cartItems)}
                </span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-semibold text-gray-900">
                  ${calculateTax(cartItems)}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${calculateTotal(cartItems)}</span>
              </div>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg font-semibold w-full mt-6 transition duration-300">
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions for subtotal, tax, and total calculations
const calculateSubtotal = (cartItems) => {
  return cartItems.reduce((acc, item) => acc + item.quantity * item.adDetails.price, 0).toFixed(2);
};

const calculateTax = (cartItems) => {
  const subtotal = calculateSubtotal(cartItems);
  return (subtotal * 0.1).toFixed(2);
};

const calculateTotal = (cartItems) => {
  const subtotal = calculateSubtotal(cartItems);
  const tax = calculateTax(cartItems);
  return (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);
};

export default CartComponent;
