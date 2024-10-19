import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from 'react-icons/fa';
import { useAuth } from '../ContextAPI/AuthContext';
import useAxiosInstance from '../ContextAPI/AxiosInstance';
import Swal from 'sweetalert2';



const CartComponent = () => {
  const { isLoggedIn, token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const axiosInstance = useAxiosInstance();
  const navigate = useNavigate();
  const { adId } = useParams();
  const [ads, setAds] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);



  const removeFromCart = async (itemId) => {
    try {
      // Make the DELETE request using axiosInstance (token handled globally)
      const response = await axiosInstance.delete(`/api/usercart/item/${itemId}`);
      
      // Log the success message
      console.log(response.data.message);

      // Remove the deleted item from the cartItems state
      setCartItems(cartItems.filter(item => item._id !== itemId));

      // Show a success alert
     
      const data = await response.json();
      
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  
  


  const handleDelete = (itemId) => {
    setItemIdToDelete(itemId); // Store the id of the item to delete
    setIsModalOpen(true); // Open the modal
  };

  // Function to confirm deletion
  const confirmDelete = async () => {
    setIsModalOpen(false); // Close the modal after confirmation
    if (itemIdToDelete) {
      // Call the API to delete the item
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
    // Make API request using axios
    const response = await axiosInstance.get('/api/usercart/item/cart');
    
    // Log the response data to see its structure
    
    // Assuming you want to store the cart items in state
    setCartItems(response.data);
    
    // Check if adId exists in the response and access its _id
    
 
    
  } catch (error) {
    // Log error details
    console.error("Error fetching cart items:", error.response?.data?.message || error.message);
  }
};

const handleClick = async (cartId) => {
  try {
    // Call the backend endpoint to fetch the adId using the cartId with axiosInstance
    const response = await axiosInstance.get(`/api/usercart/navigate/adId/${cartId}`);
    
    // Navigate to the product details page with the fetched adId
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
    <tr key={item._id}> {/* This can remain as _id for the key */}
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
        <p>{getFirstThreeWords(item.adDetails.location?.readable) || 'Location not specified'}</p>
      </td>
      <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{item.adDetails.condition}</p>
      </td>
      <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">${(item.adDetails.price).toFixed(2)}</p>
      </td>
      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm font-medium">
      <button 
  onClick={() => handleClick(item._id)} 
  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
  Product Details
</button>

      </td>
      <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm">
   
      {/* Delete button */}
      <button
        className="text-red-500 hover:text-red-700 transition duration-200"
        onClick={() => handleDelete(item._id)}
      >
        <FaTrashAlt />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            {/* Modal box */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Delete 
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to remove this from Cart? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {/* Confirm Button */}
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Yes, delete it!
                </button>
                {/* Cancel Button */}
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    
      </td>
    </tr>
  ))}
</tbody>


          </table>
        </div>

       
        
      </div>
    </div>
  );
};

// Helper functions for calculating subtotal, tax, and total


export default CartComponent;
