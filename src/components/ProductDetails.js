import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RxAvatar } from "react-icons/rx";


import useAxiosInstance from '../ContextAPI/AxiosInstance';

const ProductDetails = () => {
    const axiosInstance = useAxiosInstance(); 
    const { id } = useParams(); // Retrieve the product ID from the URL
    const [ad, setAd] = useState(null);
    const [currentImage, setCurrentImage] = useState('');
    const [otherProducts, setOtherProducts] = useState([]); // State for other products
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [ads, setAds] = useState([]);

    const [error, setError] = useState('');



    useEffect(() => {
        const fetchAds = async () => {
          try {
            // Use Axios instance to fetch the ads
            const response = await axiosInstance.get('/allads/ads');
            setAds(response.data); // Axios stores the response data in `response.data`
          } catch (error) {
            console.error("Error fetching ads:", error);
          }
        };
    
        fetchAds();
      }, [axiosInstance]);
    

      useEffect(() => {
        // Function to fetch the user's name who posted the ad
        const fetchUserName = async () => {
          try {
            // Use Axios instance to fetch the user name
            const response = await axiosInstance.get(`/user-profile-image/ad/${id}`); // Backend endpoint
            setUserName(response.data.name); // Axios stores the response data in `response.data`
            setLoading(false);
          } catch (err) {
            setError('Failed to fetch user name');
            setLoading(false);
          }
        };
    
        fetchUserName();
      }, [id, axiosInstance]);
    



      useEffect(() => {
        const fetchAdDetails = async () => {
          try {
            // Fetch ad details
            const response = await axiosInstance.get(`/product/details/ad/${id}`);
            setAd(response.data);
            setCurrentImage(response.data.images[0]); // Set the default image
    
            // Fetch other products in the same category
            const otherResponse = await axiosInstance.get(`/filtering/product/${response.data.category}`);
            setOtherProducts(otherResponse.data); // Set the other products
          } catch (error) {
            console.error("Error fetching ad details:", error);
          }
        };
    
        fetchAdDetails();
      }, [id, axiosInstance]);
    

    if (!ad) {
        return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/*User profile Image */}

           
 

        

            

        <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800"> <mark className="px-2 text-gray-900 bg-yellow-400 rounded"> <strong>{ad.brand}</strong> {ad.model}</mark> </h1>
<div className="flex flex-col md:flex-row md:justify-between">
    <div className="w-full md:w-1/2 mb-6">
        <div className="relative w-full h-80 border-4 border-gray-200 rounded-lg overflow-hidden shadow-lg">
            <img
                src={currentImage}
                alt="Product Image"
                className="w-full h-full object-contain transition-transform duration-500 ease-in-out hover:scale-110"
            />
        </div>
        <div className="flex mt-4 overflow-x-auto space-x-4">
            {ad.images.map((image, index) => (
                <div key={index} className="flex-none w-24 h-24 border-2 border-gray-200 rounded-lg shadow-md">
                    <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                        onClick={() => setCurrentImage(image)}
                    />
                </div>
            ))}
        </div>
    </div>

    <div className="w-full md:w-1/2 md:ml-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="flex items-center text-2xl font-bold mb-4 text-gray-800">
            <mark className="px-2 text-gray-900 bg-yellow-400 rounded"> <strong>Price:</strong></mark> 

                <span className="text-black text-3xl mx-2">  Rs. {ad.price}</span>
            </p>
            <p className="mb-6 text-lg text-gray-600">
            <mark className="px-2 text-gray-900 bg-yellow-400 rounded"> <strong>Description:</strong></mark> 
            <span className='font-medium'> {ad.description}
            </span>              
            </p>
            <p className="mb-6 text-lg text-gray-600">
            <mark className="px-2 text-gray-900 bg-yellow-400 rounded"> <strong>Condition:</strong></mark> 
            <span className='font-medium'> {ad.condition}
            </span>    
            </p>
            <p className="mb-6 text-lg text-gray-600">
            <mark className="px-2 text-gray-900 bg-yellow-400 rounded"> <strong>Mobile Phone:</strong></mark> 
            <span className='font-medium'> {ad.MobilePhone}
            </span>    
               
            </p>
            <p className="mb-6 text-lg text-gray-600">
            <mark className="px-2 text-gray-900 bg-yellow-400 rounded"> <strong>Catagory:</strong></mark> 
            <span className='font-medium'> {ad.category}
            </span>    

            <p className='mb-6 text-lg mt-7 text-gray-600'>
            <mark className="px-2 text-gray-900 bg-yellow-400 rounded"> <strong>Location:</strong></mark> 
            <span className='font-medium'> {(ad.location.readable)}
            </span>    

            </p>

            
            </p>
            <div className="flex items-center mb-6">
                <p className="text-lg text-gray-600"><strong>Posted by: <mark className="px-2 text-gray-900 bg-yellow-400 rounded">{ad.userId.name}</mark> </strong></p>
                {ad.userId?.profileImageUrl ? (
    <img
    src={ad.userId.profileImageUrl}
    alt="User profile"
    className="w-10 h-10 rounded-full object-cover ml-2"
    />
) : (
    <RxAvatar className="w-8 h-8 text-yellow-400 rounded-full object-cover ml-2" />
)}
            </div>
  

            <button className="mt-6 w-full bg-yellow-500 to-yellow-600 text-white py-3 rounded-lg shadow-lg text-lg font-semibold transition duration-300 hover:from-yellow-600 hover:to-yellow-700 hover:shadow-xl">
                Contact Seller
            </button>
        </div>
    </div>
</div>


            {/* Other Products Section */}
            <h3 className="text-xl text-center mt-6 mb-5 font-semibold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl">
                Others Products <mark className="px-2 text-gray-900 bg-yellow-400 rounded">You May</mark> Like!
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {otherProducts.length > 0 ? (
                    otherProducts.map((product) => (
                        <div key={product._id} className="bg-white rounded-lg shadow-lg p-4">
                            <img src={product.images[0]} alt={product.model} className="w-full h-48 object-cover rounded-lg" />
                            <h3 className="text-lg font-semibold mt-2">{product.brand} {product.model}</h3>
                            <p className="text-yellow-500 text-xl">Rs. {product.price}</p>
                            <button 
                                className="mt-2 w-full bg-yellow-400 py-2 rounded-lg font-semibold shadow-md hover:bg-yellow-500 text-black transition duration-200"
                                onClick={() => {
                                  navigate(`/product/${product._id}`); // Navigate to the product details page
                                  window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top smoothly
                              }}
                            >
                                View Details
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 text-center text-gray-500">
                        No other products available.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
