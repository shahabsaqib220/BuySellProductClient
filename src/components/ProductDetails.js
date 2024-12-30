import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RxAvatar } from "react-icons/rx";
import { useAuth } from '../ContextAPI/AuthContext';
import { useDispatch } from 'react-redux';
import { setUserAndAd } from '../Redux/usersChatSlice';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import Skeleton from '@mui/material/Skeleton';
import { FaCrown } from 'react-icons/fa';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PlaceIcon from '@mui/icons-material/Place';
import useAxiosInstance from '../ContextAPI/AxiosInstance';
import Snackbar from '@mui/material/Snackbar';

import MuiAlert from '@mui/material/Alert';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import Alert from '@mui/material/Alert';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';

const ProductDetails = () => {
    const axiosInstance = useAxiosInstance(); 
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const { user, isLoggedIn } = useAuth();
    const dispatch = useDispatch();
    const { id } = useParams();
    const [ad, setAd] = useState(null);
    const [currentImage, setCurrentImage] = useState('');
    const [otherProducts, setOtherProducts] = useState([]);
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [ads, setAds] = useState([]);
    const [error, setError] = useState('');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleAddToCart = async (ad) => {
        if (!isLoggedIn) {
            setSnackbarMessage('Sign in to use your cart');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            return;
        }

        try {
            await axiosInstance.post('/filtering/user/cart', {
                adId: ad._id,
                brand: ad.brand,
                model: ad.model,
                price: ad.price,
                condition: ad.condition,
                location: ad.location,
                quantity: 1,
                images: ad.images,
            });

            setSnackbarMessage('Item added to cart');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error adding item to cart:', error);
            setSnackbarMessage('Failed to add item to cart');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await axiosInstance.get('/allads/ads');
                setAds(response.data);
            } catch (error) {
                console.error("Error fetching ads:", error);
            }
        };

        fetchAds();
    }, [axiosInstance]);

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const response = await axiosInstance.get(`/user-profile-image/ad/${id}`);
                setUserName(response.data.name);
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
                const response = await axiosInstance.get(`/product/details/ad/${id}`);
                console.log("Ad Details Response:", response);
                setAd(response.data);
                setCurrentImage(response.data.images[0]);

                const otherResponse = await axiosInstance.get(`/filtering/product/${response.data.category}`);
                console.log("Other Products Response:", otherResponse);
                setOtherProducts(otherResponse.data);
            } catch (error) {
                console.error("Error fetching ad details:", error);
            }
        };

        fetchAdDetails();
    }, [id, axiosInstance]);

    const handleChatClick = (ad) => {
        if (isLoggedIn && user) {
            navigate('/chat');
        } else {
            setSnackbarMessage("Sign in to chat with the seller");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
        }
    };

    if (!ad) {
        return (
            <div className="p-4">
                <div className="mb-4">
                    <Skeleton variant="rectangular" width="100%" height={200} animation="wave" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton variant="rectangular" width="100%" height={150} animation="wave" />
                    <Skeleton variant="rectangular" width="100%" height={150} animation="wave" />
                    <Skeleton variant="rectangular" width="100%" height={150} animation="wave" />
                    <Skeleton variant="rectangular" width="100%" height={150} animation="wave" />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">
                <mark className="px-2 text-gray-900 bg-yellow-400 rounded">
                    <strong>{ad.brand}</strong> {ad.model}
                </mark>
            </h1>
            <div className="flex flex-col md:flex-row md:justify-between">
            <div className="w-full md:w-1/2 mb-6 relative">
            <div className="relative w-full h-80 border-4 border-gray-300 rounded-lg overflow-hidden shadow-lg bg-gray-50">
  {ad.premium && (
    <span className="absolute top-2 left-2 bg-yellow-400 text-black text-md font-semibold px-3 py-1 rounded flex items-center animate-light-switch-yellow">
      <FaCrown className="mr-1" />
      Premium Featured Ad
    </span>
  )}

  {ad.standard && (
    <span className="absolute top-2 left-2 bg-blue-500 text-white text-md font-semibold px-3 py-1 rounded flex items-center animate-light-switch-blue">
      <FaCrown className="mr-1" />
      Standard Featured Ad
    </span>
  )}
  
  {ad.basic && (
    <span className="absolute top-2 left-2 bg-green-500 text-white text-md font-semibold px-3 py-1 rounded flex items-center animate-light-switch-green">
      <FaCrown className="mr-1" />
      Basic Featured Ad
    </span>
  )}

  <img
    src={currentImage}
    alt="Product Image"
    className="w-full h-full object-contain transition-transform duration-500 ease-in-out hover:scale-110"
  />
</div>

    <div className="flex mt-4 overflow-x-auto space-x-4">
        {ad.images.map((image, index) => (
            <div
                key={index}
                className="flex-none w-24 h-24 border-2 border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
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
                            <mark className="px-2 text-gray-900 bg-yellow-400 rounded">
                                <strong>Price:</strong>
                            </mark>
                            <span className="text-black text-3xl mx-2"> Rs. {ad.price}/-</span>
                        </p>
                        <p className="mb-6 text-lg text-gray-600">
                            <mark className="px-2 text-gray-900 bg-yellow-400 rounded">
                                <strong>Description:</strong>
                            </mark>
                            <span className='font-medium'> {ad.description}</span>
                        </p>
                        <p className="mb-6 text-lg text-gray-600">
                            <mark className="px-2 text-gray-900 bg-yellow-400 rounded">
                                <strong>Condition:</strong>
                            </mark>
                            <span className='font-medium'> {ad.condition}</span>
                        </p>
                        <p className="mb-6 text-lg text-gray-600">
                            <mark className="px-2 text-gray-900 bg-yellow-400 rounded">
                                <strong>Mobile Phone:</strong>
                            </mark>
                            <span className='font-medium'> {ad.MobilePhone}</span>
                        </p>
                        <p className="mb-6 text-lg text-gray-600">
                            <mark className="px-2 text-gray-900 bg-yellow-400 rounded">
                                <strong>catagory:</strong>
                            </mark>
                            <span className='font-medium'> {ad.category}</span>
                        </p>
                      
                        <p className='mb-6 text-lg mt-7 text-gray-600'>
                            <mark className="px-2 text-gray-900 bg-yellow-400 rounded">
                                <strong>Location:</strong>
                            </mark>
                            <span className='font-medium'> {ad.location.readable}</span>
                        </p>

                        <div className="flex items-center mb-6">
                            <p className="text-lg text-gray-600">
                                <strong>Posted by: <mark className="px-2 text-gray-900 bg-yellow-400 rounded">{ad.userId.name}</mark></strong>
                            </p>
                            {ad.userId?.profileImageUrl ? (
                                <img
                                    src={ad.userId.profileImageUrl}
                                    alt="User  profile"
                                    className="w-10 h-10 rounded-full object-cover ml-2"
                                />
                            ) : (
                                <RxAvatar className="w-8 h-8 text-yellow-400 rounded-full object-cover ml-2" />
                            )}
                        </div>

                        <button onClick={() => handleChatClick(ad)} className="mt-6 w-full bg-yellow-500 to-yellow-600 text-black py-3 rounded-lg shadow-lg text-lg font-semibold transition duration-300 hover:from-yellow-600 hover:to-yellow-700 hover:shadow-xl">
                            <QuestionAnswerIcon className='mr-5' />
                            Contact Seller
                        </button>
                        <button
                            onClick={() => handleAddToCart(ad)}
                            className="mt-6 w-full bg-yellow-500 to-yellow-600 text-black py-3 rounded-lg shadow-lg text-lg font-semibold transition duration-300 hover:from-yellow-600 hover:to-yellow-700 hover:shadow-xl">
                            <ShoppingCartCheckoutIcon className='mr-7' />
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Other Products Section */}
            <h3 className="text-xl text-center mt-6 mb-5 font-semibold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl">
    Others Products <mark className="px-2 text-gray-900 bg-yellow-400 rounded">You May</mark> Like!
</h3>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {otherProducts.length > 0 ? (
        <>
            {/* Premium Products */}
            {otherProducts.filter(product => product.premium).length > 0 && (
                <>
                    {otherProducts
                        .filter(product => product.premium)
                        .map((product) => (
                            <div key={product._id} className="bg-white rounded-lg shadow-lg p-4 relative">
                                <span className="bg-yellow-400 text-black font-semibold px-4 py-1 rounded flex items-center gap-2 animate-light-switch-yellow">
  <FaCrown className="text-lg text-black" /> Premium Featured Ad
</span>
                                <img
                                    src={product.images[0]}
                                    alt={product.model}
                                    className="w-full relative h-48 object-cover rounded-lg"
                                />
                                <div className="flex justify-between items-center mt-6">
                              
                                    <h3 className="text-lg font-semibold">
                                        {product.brand} {product.model}
                                    </h3>
                                    <div className="bg-yellow-400 flex text-black p-2 rounded-full shadow-lg hover:bg-yellow-500 transition duration-200 cursor-pointer">
                                        <ShoppingCartIcon fontSize="small" onClick={() => handleAddToCart(product)} />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <p className="text-black font-semibold text-xl">
                                        <mark className="bg-yellow-400 text-black px-2 py-1 rounded">
                                            Rs. {product.price}/-
                                        </mark>
                                    </p>
                                    <p className="text-black font-semibold text-md">
                                        {product.condition}
                                    </p>
                                    <div className="flex items-center ">
                                        <PlaceIcon className="text-md " />
                                        <span className="text-black font-medium">{product.location.readable}</span>
                                    </div>
                                </div>
                                <button
                                    className="mt-4 w-full bg-yellow-400 py-2 rounded-lg font-semibold shadow-md flex items-center justify-center gap-2 hover:bg-yellow-500 text-black transition duration-200"
                                    onClick={() => {
                                        navigate(`/product/${product._id}`);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                >
                                    <ViewTimelineIcon className="lg:mr-3" />
                                    View Details
                                </button>
                            </div>
                        ))}
                </>
            )}

            {/* Standard Products */}
            {otherProducts.filter(product => product.standard).length > 0 && (
                <>
                    {otherProducts
                        .filter(product => product.standard)
                        .map((product) => (
                            <div key={product._id} className="bg-white rounded-lg shadow-lg p-4 relative">
                                                            <span className="bg-blue-500 text-white font-semibold px-4 py-1 rounded flex items-center gap-2 animate-light-switch-blue">
  <FaCrown className="text-lg text-white" /> Standard Featured Ad
</span>
                                <img
                                    src={product.images[0]}
                                    alt={product.model}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                               

                                <div className="flex justify-between items-center mt-6">
                                    <h3 className="text-lg font-semibold">
                                        {product.brand} {product.model}
                                    </h3>
                                    <div className="bg-yellow-400 flex text-black p-2 rounded-full shadow-lg hover:bg-yellow-500 transition duration-200 cursor-pointer">
                                        <ShoppingCartIcon fontSize="small" onClick={() => handleAddToCart(product)} />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <p className="text-black font-semibold text-xl">
                                        <mark className="bg-yellow-400 text-black px-2 py-1 rounded">
                                            Rs. {product.price}/-
                                        </mark>
                                    </p>
                                    <p className="text-black font-semibold text-md">
                                        {product.condition}
                                    </p>
                                    <div className="flex items-center ">
                                        <PlaceIcon className="text-md " />
                                        <span className="text-black font-medium">{product.location.readable}</span>
                                    </div>
                                </div>
                                <button
                                    className="mt-4 w-full bg-yellow-400 py-2 rounded-lg font-semibold shadow-md flex items-center justify-center gap-2 hover:bg-yellow-500 text-black transition duration-200"
                                    onClick={() => {
                                        navigate(`/product/${product._id}`);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                >
                                    <ViewTimelineIcon className="lg:mr-3" />
                                    View Details
                                </button>
                            </div>
                        ))}
                </>
            )}

            {/* Basic Products */}
            {otherProducts.filter(product => product.basic).length > 0 && (
                <>
                    {otherProducts
                        .filter(product => product.basic)
                        .map((product) => (
                            <div key={product._id} className="bg-white rounded-lg shadow-lg p-4 relative">
                                <span className="bg-green-500 text-white font-semibold px-4 py-1 rounded flex items-center gap-2 animate-light-switch-green">
  <FaCrown className="text-lg text-white" /> Basic Featured Ad
</span>
                                <img
                                    src={product.images[0]}
                                    alt={product.model}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                <div className="flex justify-between items-center mt-6">
                                    <h3 className="text-lg font-semibold">
                                        {product.brand} {product.model}
                                    </h3>
                                    <div className="bg-yellow-400 flex text-black p-2 rounded-full shadow-lg hover:bg-yellow-500 transition duration-200 cursor-pointer">
                                        <ShoppingCartIcon fontSize="small" onClick={() => handleAddToCart(product)} />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <p className="text-black font-semibold text-xl">
                                        <mark className="bg-yellow-400 text-black px-2 py-1 rounded">
                                            Rs. {product.price}/-
                                        </mark>
                                    </p>
                                    <p className="text-black font-semibold text-md">
                                        {product.condition}
                                    </p>
                                    <div className="flex items-center ">
                                        <PlaceIcon className="text-md " />
                                        <span className="text-black font-medium">{product.location.readable}</span>
                                    </div>
                                </div>
                                <button
                                    className="mt-4 w-full bg-yellow-400 py-2 rounded-lg font-semibold shadow-md flex items-center justify-center gap-2 hover:bg-yellow-500 text-black transition duration-200"
                                    onClick={() => {
                                        navigate(`/product/${product._id}`);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                >
                                    <ViewTimelineIcon className="lg:mr-3" />
                                    View Details
                                </button>
                            </div>
                        ))}
                </>
            )}

            {/* Other Products without tags */}
            {otherProducts.filter(product => !product.premium && !product.standard && !product.basic).length > 0 && (
                <>
                    {otherProducts
                        .filter(product => !product.premium && !product.standard && !product.basic)
                        .map((product) => (
                            <div key={product._id} className="bg-white rounded-lg shadow-lg p-4 relative">

                                <img
                                    src={product.images[0]}
                                    alt={product.model}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                <div className="flex justify-between items-center mt-6">
                                    <h3 className="text-lg font-semibold">
                                        {product.brand} {product.model}
                                    </h3>
                                    <div className="bg-yellow-400 flex text-black p-2 rounded-full shadow-lg hover:bg-yellow-500 transition duration-200 cursor-pointer">
                                        <ShoppingCartIcon fontSize="small" onClick={() => handleAddToCart(product)} />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <p className="text-black font-semibold text-xl">
                                        <mark className="bg-yellow-400 text-black px-2 py-1 rounded">
                                            Rs. {product.price}/-
                                        </mark>
                                    </p>
                                    <p className="text-black font-semibold text-md">
                                        {product.condition}
                                    </p>
                                    <div className="flex items-center ">
                                        <PlaceIcon className="text-md " />
                                        <span className="text-black font-medium">{product.location.readable}</span>
                                    </div>
                                </div>
                                <button
                                    className="mt-4 w-full bg-yellow-400 py-2 rounded-lg font-semibold shadow-md flex items-center justify-center gap =2 hover:bg-yellow-500 text-black transition duration-200"
                                    onClick={() => {
                                        navigate(`/product/${product._id}`);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                >
                                    <ViewTimelineIcon className="lg:mr-3" />
                                    View Details
                                </button>
                            </div>
                        ))}
                </>
            )}
        </>
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