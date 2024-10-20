import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from 'react-icons/fa';
import { useAuth } from '../ContextAPI/AuthContext';
import useAxiosInstance from '../ContextAPI/AxiosInstance';
import Swal from 'sweetalert2';

const CartComponent = () => {
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const axiosInstance = useAxiosInstance();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);

  const removeFromCart = async (itemId) => {
    try {
      await axiosInstance.delete(`/usercart/item/${itemId}`);
      setCartItems(cartItems.filter(item => item._id !== itemId));
      Swal.fire('Deleted!', 'Item has been removed from your cart.', 'success');
    } catch (error) {
      console.error('Error deleting item:', error);
      Swal.fire('Error!', 'Failed to remove item from cart.', 'error');
    }
  };

  const handleDelete = (itemId) => {
    setItemIdToDelete(itemId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsModalOpen(false);
    if (itemIdToDelete) {
      await removeFromCart(itemIdToDelete);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartItems();
    }
  }, [isLoggedIn]);

  const fetchCartItems = async () => {
    try {
      const response = await axiosInstance.get('/usercart/item/cart');
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error.response?.data?.message || error.message);
    }
  };

  const handleClick = async (cartId) => {
    try {
      const response = await axiosInstance.get(`/usercart/navigate/adId/${cartId}`);
      navigate(`/product/${response.data.adId}`);
    } catch (error) {
      console.error('Error fetching adId:', error.response?.data?.message || error.message);
    }
  };

  const getFirstThreeWords = (location) => {
    if (!location) return '';
    const words = location.split(' ');
    return words.slice(0, 3).join(' ');
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
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-16 h-16">
                        {item.adDetails.images && item.adDetails.images.length > 0 ? (
                          <img
                            className="w-full h-full object-cover rounded-lg"
                            src={item.adDetails.images[0]}
                            alt={item.adDetails.images[0].alt}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                            <span>No Image Available</span>
                          </div>
                        )}
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
                    <p>{getFirstThreeWords(item.adDetails.location?.readable) || 'Location not specified'}</p>
                  </td>
                  <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{item.adDetails.condition}</p>
                  </td>
                  <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      Rs {item.adDetails.price ? item.adDetails.price.toFixed(2) : 'N/A'}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm font-medium">
                    <button 
                      onClick={() => handleClick(item._id)} 
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                      Product Details
                    </button>
                  </td>
                  <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(item._id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex justify-center items-center">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg w-full max-w-md mx-auto">
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Confirm Delete
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to remove this item from your cart?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={confirmDelete}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-300 text-base font-medium text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartComponent;
