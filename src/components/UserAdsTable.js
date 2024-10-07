import React, { useState, useEffect } from 'react';
import useAxiosInstance from '../ContextAPI/AxiosInstance';


const UserAdsTable = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const adsPerPage = 10; // Constant for ads per page
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSoldOutModal, setShowSoldOutModal] = useState(false);
  const [adToDelete, setAdToDelete] = useState(null);
  const axiosInstance = useAxiosInstance(); 


  const [adToMarkSold, setAdToMarkSold] = useState(null);
  useEffect(() => {
    const fetchUserAds = async () => {
      setLoading(true); // Set loading to true when starting the fetch
  
      try {
        // Use axiosInstance to get ads data
        const response = await axiosInstance.get('/viewsads/myads');
  
        if (response.status === 200) {
          const data = response.data;
          
          if (data.ads.length === 0) {
            setError('No ads posted yet'); // Set "No ads posted yet" error message
            setAds([]); // Ensure ads is set to an empty array
          } else {
            setAds(data.ads); // Populate ads if they exist
            setError(null); // Clear any previous errors
          }
        } else {
          setError(response.data.message || 'Error fetching ads');
        }
      } catch (error) {
        setError('Error fetching ads'); // Handle any network or server errors
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };
  
    fetchUserAds();
  }, [axiosInstance]);
  
  
  
  
  
  

  // Handle actions like Edit, Sell Fast, Mark Sold, Delete
  const handleAction = (action, adId) => {
    switch (action) {
      case 'deletead':
        setAdToDelete(adId);
        setShowDeleteModal(true);
        break;
      // Placeholder for other actions
      // case 'edit':
      // case 'sellFast':
      case 'markSold':      
      setAdToMarkSold(adId);  // Save adId in state
      setShowSoldOutModal(true); // Show the modal
        break;
      default:
    
      // Call the function to mark ad as sold
      break;
    }
  };


  const markAsSold = async (adId) => {
    try {
      // Use axiosInstance to send the PUT request
      const response = await axiosInstance.put(`/userproducts/solded/soldout/${adId}`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Check if the request was successful
      if (response.status !== 200) throw new Error('Error marking ad as sold');
  
      // Update ads in the state
      setAds((prevAds) =>
        prevAds.map((ad) =>
          ad._id === adId ? { ...ad, adStatus: true } : ad
        )
      );
  
      setShowSoldOutModal(false); // Close modal
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  
  

  // Confirm deletion of an ad
  const handleDeleteAd = async () => {
    if (adToDelete) {
      try {
        // Use axiosInstance to send the DELETE request
        const response = await axiosInstance.delete(`/deletead/deletead/${adToDelete}`);
  
        // Check if the request was successful
        if (response.status !== 200) throw new Error('Error deleting ad');
  
        // Update the ads in the state by removing the deleted ad
        setAds((prevAds) => prevAds.filter((ad) => ad._id !== adToDelete));
        
        // Close the delete modal and reset adToDelete
        setShowDeleteModal(false);
        setAdToDelete(null);
        
      } catch (error) {
        console.error('Error deleting ad:', error);
      }
    }
  };
  

  const toggleDropdown = (adId) => setActiveDropdown((prev) => (prev === adId ? null : adId));

  // Toggle description expansion
  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Pagination logic
  const indexOfLastAd = currentPage * adsPerPage;
  const indexOfFirstAd = indexOfLastAd - adsPerPage;
  const currentAds = ads.slice(indexOfFirstAd, indexOfLastAd);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Description chunking helper function
  const chunkDescription = (description, wordsPerLine = 9) => {
    const words = description.split(' ');
    const chunks = [];
    for (let i = 0; i < words.length; i += wordsPerLine) {
      chunks.push(words.slice(i, i + wordsPerLine).join(' '));
    }
    return chunks;
  };




  if (loading) {
    return (
      <div>
        <p>Loading ads...</p>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-8 bg-gray-300 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;

  if (ads.length === 0) return <p>No ads found.</p>;

  return (
    <div>
      
      <div className="flex justify-between items-center mb-4 ml-4 mt-4">
        <h3 className="text-xl font-semibold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl dark:text-white">
          Control Your Ads: <mark className="px-2 text-gray-900 bg-yellow-400 rounded dark:bg-blue-500">Edit, Sell, or</mark> Mark as Sold
        </h3>
        
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-black bg-yellow-400 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">S.No</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Brand</th>
              <th className="px-6 py-3">Model</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Mobile Number</th>
              <th className="px-6 py-3">Condition</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentAds.map((ad, index) => (
              <tr key={ad._id} className="px-6 py-4 font-medium font-semibold text-gray-900 whitespace-nowrap dark:text-white">
                <td className="border px-4 py-2">{(currentPage - 1) * adsPerPage + index + 1}</td>
                <td className="border px-4 py-2">{ad.category}</td>
                <td className="border px-4 py-2">{ad.brand}</td>
                <td className="border px-4 py-2">{ad.model}</td>
                <td className="border px-4 py-2">{ad.price}</td>
                <td className="border px-4 py-2">
                  {expandedDescriptions[ad._id] || ad.description.split(' ').length <= 5 ? (
                    <div>
                      {chunkDescription(ad.description, 9).map((line, lineIndex) => (
                        <div key={lineIndex}>{line}</div>
                      ))}
                    </div>
                  ) : (
                    `${ad.description.split(' ').slice(0, 5).join(' ')}...`
                  )}
                  <span className="text-blue-500 hover:underline cursor-pointer" onClick={() => toggleDescription(ad._id)}>
                    {expandedDescriptions[ad._id] ? ' See Less' : ' See Description'}
                  </span>
                </td>
                <td className="border px-4 py-2">{ad.MobilePhone}</td>
                <td className="border px-4 py-2">{ad.condition}</td>
                <td className="relative px-6 py-4">
                  <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => toggleDropdown(ad._id)}>
                    Edit
                  </a>
                  {activeDropdown === ad._id && (
                    <div className="absolute z-10 mt-2 w-48 bg-white border rounded shadow-lg dark:bg-gray-800">
                      <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                        <li className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer" onClick={() => handleAction('sellFast', ad._id)}>
                          Sell Fast
                        </li>
                        <li className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer" onClick={() => handleAction('markSold', ad._id)}>
                          Mark as Sold
                        </li>
                        <li className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer" onClick={() => handleAction('deletead', ad._id)}>
                          Delete
                        </li>
           
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}

     



          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        {Array.from({ length: Math.ceil(ads.length / adsPerPage) }).map((_, i) => (
          <button
            key={i + 1}
            className={`mx-1 px-3 py-2 rounded ${
              currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => paginate(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
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
                        d="M13 16h-1v-4h-1m0-4h.01M12 16h.01M8 8h8m-4-4v12"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Delete Ad
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Are you sure you want to delete this ad? This action cannot be undone.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteAd}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Mark as Sold Out Modal */}
      {showSoldOutModal && (
  <div className="fixed inset-0 z-10 overflow-y-auto">
    <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
        &#8203;
      </span>
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg
                className="h-6 w-6 text-red-600"
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
                  d="M13 16h-1v-4h-1m0-4h.01M12 16h.01M8 8h8m-4-4v12"
                />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Mark Ad as Sold
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">Are you sure you want to mark this Ad as Soldout? This action cannot be undone.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={() => markAsSold(adToMarkSold)}  // Use adToMarkSold state
          >
            Mark Soldout
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={() => setShowSoldOutModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default UserAdsTable;