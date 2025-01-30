import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RxAvatar } from "react-icons/rx";
import { useAuth } from '../ContextAPI/AuthContext';
import { useDispatch } from 'react-redux';
import pakistanCities from "../utils/PakistanCities";
import { setUserAndAd } from '../Redux/usersChatSlice';

import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import Skeleton from '@mui/material/Skeleton';
import { FaCrown } from 'react-icons/fa';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PlaceIcon from '@mui/icons-material/Place';
import useAxiosInstance from '../ContextAPI/AxiosInstance';
import Snackbar from '@mui/material/Snackbar';
import { BiMessageDetail } from "react-icons/bi"

import MuiAlert from '@mui/material/Alert';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import Alert from '@mui/material/Alert';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import { Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

const ProductDetails = () => {
    const axiosInstance = useAxiosInstance(); 
    const { t } = useTranslation();
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

    const translateLocation = (location) => {
        const formattedLocation = location
            .toLowerCase()
            .replace(/\s+/g, "_") // Replace spaces with underscores
            .replace(/[^\w_]/g, ""); // Remove special characters
    
        // Check if the location exists in the list of cities
        if (pakistanCities.includes(formattedLocation)) {
            return t(formattedLocation); // Fetch translation from i18n
        }
    
        // Return original location if no match is found
        return location;
    };





    const handleAddToCart = async (ad) => {
        if (!isLoggedIn) {
          setSnackbarMessage(t('signInToUseCart'));
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

            setSnackbarMessage(t("itemAddedToCart"));
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



    const truncateDescription = (description, maxCharsPerLine = 50, maxLines = 3) => {
        const words = description.split(' ');
        let truncated = '';
        let currentLine = '';
        let lineCount = 0;
    
        for (let word of words) {
            if ((currentLine + word).length > maxCharsPerLine) {
                truncated += currentLine.trim() + '\n';
                currentLine = word + ' ';
                lineCount++;
    
                if (lineCount >= maxLines) {
                    truncated += '...';
                    break;
                }
            } else {
                currentLine += word + ' ';
            }
        }
    
        if (lineCount < maxLines) {
            truncated += currentLine.trim();
        }
    
        return truncated.trim();
    };

    const translateCondition = (condition) => {
        const normalizeKey = (key) => key.trim().toLowerCase().replace(/ +/g, ' ');
        
        const conditions = {
          [normalizeKey("used")]: t("used"),
          [normalizeKey("brand new")]: t("brand new"),
          [normalizeKey("refurbished")]: t("refurbished"),
          // Add other conditions here as needed
        };
      
        const normalizedCondition = normalizeKey(condition);
        return conditions[normalizedCondition] || condition;
      };

      
    
      



    const handleChatClick = (ad) => {
        if (isLoggedIn && user) {
            navigate('/chat');
        } else {
          setSnackbarMessage(t('signInToChat'));
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
        }
    };


    const getFirstTwoWords = (location) => {
        if (!location) return "";
        const words = location.split(" ");
        return words.length > 1 ? `${words[0]} ${words[1]}` : words[0];
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
      {t("premiumFeaturedAd")}
    </span>
  )}

  {ad.standard && (
    <span className="absolute top-2 left-2 bg-blue-500 text-white text-md font-semibold px-3 py-1 rounded flex items-center animate-light-switch-blue">
      <FaCrown className="mr-1" />
      {t("standardFeaturedAd")}
    </span>
  )}
  
  {ad.basic && (
    <span className="absolute top-2 left-2 bg-green-500 text-white text-md font-semibold px-3 py-1 rounded flex items-center animate-light-switch-green">
      <FaCrown className="mr-1" />
      {t("basicFeaturedAd")}
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
    <div className="bg-white rounded-lg shadow-xl p-8">
        {/* Price Section */}
        <div className="flex items-center mb-8">
            <mark className="px-3 py-1 text-gray-900 bg-yellow-400 rounded text-xl font-bold">
                <strong>{t('price')}:</strong>
            </mark>
            <span className="text-black text-3xl font-bold ml-3">Rs. {ad.price}/-</span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8">
            {/* Description */}
            <div className="flex items-center">
                <mark className="px-3 py-1 text-gray-900 bg-yellow-400 rounded text-lg font-bold mr-3">
                    <strong>{t("description")}:</strong>
                </mark>
                <span className="text-gray-700 font-medium">{ad.description}</span>
            </div>

            {/* Condition */}
            <div className="flex items-center">
                <mark className="px-3 py-1 text-gray-900 bg-yellow-400 rounded text-lg font-bold mr-3">
                    <strong>{t("condition")}:</strong>
                </mark>
                <span className="text-gray-700 font-medium">{translateCondition(ad.condition)}</span>
            </div>

            {/* Mobile Phone */}
            <div className="flex items-center">
                <mark className="px-3 py-1 text-gray-900 bg-yellow-400 rounded text-lg font-bold mr-3">
                    <strong>{t("mobilePhone")}:</strong>
                </mark>
                <span className="text-gray-700 font-medium">{ad.MobilePhone}</span>
            </div>

            {/* Category */}
            <div className="flex items-center">
                <mark className="px-3 py-1 text-gray-900 bg-yellow-400 rounded text-lg font-bold mr-3">
                    <strong>{t("category")}:</strong>
                </mark>
                <span className="text-gray-700 font-medium">{ad.category}</span>
            </div>

            {/* Location */}
            <div className="flex items-center">
                <mark className="px-3 py-1 text-gray-900 bg-yellow-400 rounded text-lg font-bold mr-3">
                    <strong>{t("location")}:</strong>
                </mark>
                <span className="text-gray-700 font-medium">
                    {translateLocation(getFirstTwoWords(ad.location.readable))}
                </span>
            </div>
        </div>

        {/* Posted By Section */}
        <div className="flex items-center mb-8">
            <p className="text-lg text-gray-700 font-bold mr-3">
                Posted by: <mark className="px-3 py-1 text-gray-900 bg-yellow-400 rounded">{ad.userId.name}</mark>
            </p>
            {ad.userId?.profileImageUrl ? (
                <img
                    src={ad.userId.profileImageUrl}
                    alt="User profile"
                    className="w-10 h-10 rounded-full object-cover ml-2"
                />
            ) : (
                <RxAvatar className="w-10 h-10 text-yellow-400 rounded-full object-cover ml-2" />
            )}
        </div>

        {/* Buttons Section */}
        <div className="space-y-4">
            <button
                onClick={() => handleChatClick(ad)}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-3 rounded-lg shadow-lg text-lg font-semibold transition duration-300 hover:from-yellow-600 hover:to-yellow-700 hover:shadow-xl flex items-center justify-center"
            >
                <QuestionAnswerIcon className="w-5 h-5 mr-3" />
                <span>{t("contactSeller")}</span>
            </button>

            <button
                onClick={() => handleAddToCart(ad)}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-3 rounded-lg shadow-lg text-lg font-semibold transition duration-300 hover:from-yellow-600 hover:to-yellow-700 hover:shadow-xl flex items-center justify-center"
            >
                <ShoppingCartCheckoutIcon className="w-5 h-5 mr-3" />
                <span>{t("addToCart")}</span>
            </button>
        </div>
    </div>
</div>
            </div>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Other Products Section */}
            <h3 className="text-2xl text-center mt-8 mb-6 font-bold text-gray-900">
  {t("othersProducts")} <mark className="px-2 text-white bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg shadow-md">{t("youMayLike")}</mark>!
</h3>

<div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
  {otherProducts.length > 0 ? (
    <>
      {/* Premium Products */}
      {otherProducts.filter(product => product.premium).length > 0 && (
        <>
          {otherProducts
            .filter(product => product.premium)
            .map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <span className="block bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold px-4 py-2 text-sm uppercase tracking-wide">
                  <FaCrown className="inline-block mr-2" /> {t("premiumFeaturedAd")}
                </span>
                <img
                  src={product.images[0]}
                  alt={product.model}
                  className="w-full h-56 object-cover transform hover:scale-105 transition-transform duration-300"
                />
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">
                      {product.brand} {product.model}
                    </h3>
                    <button
                      className="bg-yellow-400 p-2 rounded-full shadow-lg hover:bg-yellow-500 transition-colors duration-200"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCartIcon className="text-black" />
                    </button>
                  </div>
                  <p className="text-gray-600 mt-4 line-clamp-3">
                    {truncateDescription(product.description, 50, 3)}
                  </p>
                  <div className="mt-6 flex justify-between items-center">
                    <p className="text-xl font-bold text-gray-900">
                      <mark className="bg-yellow-400 text-black px-3 py-1 rounded-lg shadow-sm">
                        {t('price')} {product.price}/-
                      </mark>
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      {translateCondition(product.condition)}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center text-gray-600">
                    <PlaceIcon className="mr-2" />
                    <span>{translateLocation(getFirstTwoWords(product.location.readable))}</span>
                  </div>
                  <button
                    className="mt-6 w-full bg-gradient-to-r from-yellow-400 to-yellow-500 py-3 rounded-lg font-bold text-black shadow-md hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 flex items-center justify-center"
                    onClick={() => {
                      navigate(`/product/${product._id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
  
                    }}
                  >
                    <ViewTimelineIcon className="mr-2" />
                    {t("viewDetails")}
                  </button>
                  <button type="button" onClick={() => handleChatClick(ad)} className="w-full flex items-center justify-center gap-2 focus:outline-none text-black font-semibold bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 mt-5 rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
  <BiMessageDetail className="text-lg" />
  {t("chatWithSeller")}
</button>
                </div>
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
              <div key={product._id} className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <span className="block bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold px-4 py-2 text-sm uppercase tracking-wide">
                  <FaCrown className="inline-block mr-2" /> {t("standardFeaturedAd")}
                </span>
                <img
                  src={product.images[0]}
                  alt={product.model}
                  className="w-full h-56 object-cover transform hover:scale-105 transition-transform duration-300"
                />
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">
                      {product.brand} {product.model}
                    </h3>
                    <button
                      className="bg-yellow-400 p-2 rounded-full shadow-lg hover:bg-yellow-500 transition-colors duration-200"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCartIcon className="text-black" />
                    </button>
                  </div>
                  <p className="text-gray-600 mt-4 line-clamp-3">
                    {truncateDescription(product.description, 50, 3)}
                  </p>
                  <div className="mt-6 flex justify-between items-center">
                    <p className="text-xl font-bold text-gray-900">
                      <mark className="bg-yellow-400 text-black px-3 py-1 rounded-lg shadow-sm">
                        {t('price')} {product.price}/-
                      </mark>
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      {translateCondition(product.condition)}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center text-gray-600">
                    <PlaceIcon className="mr-2" />
                    <span>{translateLocation(getFirstTwoWords(product.location.readable))}</span>
                  </div>
                  <button
                    className="mt-6 w-full bg-gradient-to-r from-yellow-400 to-yellow-500 py-3 rounded-lg font-bold text-black shadow-md hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 flex items-center justify-center"
                    onClick={() => {
                      navigate(`/product/${product._id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <ViewTimelineIcon className="mr-2" />
                    {t("viewDetails")}
                  </button>
                  <button type="button" onClick={() => handleChatClick(ad)} className="w-full flex items-center justify-center gap-2 focus:outline-none text-black font-semibold bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 mt-5 rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
  <BiMessageDetail className="text-lg" />
  {t("chatWithSeller")}
</button>
                </div>
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
              <div key={product._id} className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <span className="block bg-gradient-to-r from-green-500 to-green-600 text-white font-bold px-4 py-2 text-sm uppercase tracking-wide">
                  <FaCrown className="inline-block mr-2" /> {t("basicFeaturedAd")}
                </span>
                <img
                  src={product.images[0]}
                  alt={product.model}
                  className="w-full h-56 object-cover transform hover:scale-105 transition-transform duration-300"
                />
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">
                      {product.brand} {product.model}
                    </h3>
                    <button
                      className="bg-yellow-400 p-2 rounded-full shadow-lg hover:bg-yellow-500 transition-colors duration-200"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCartIcon className="text-black" />
                    </button>
                  </div>
                  <p className="text-gray-600 mt-4 line-clamp-3">
                    {truncateDescription(product.description, 50, 3)}
                  </p>
                  <div className="mt-6 flex justify-between items-center">
                    <p className="text-xl font-bold text-gray-900">
                      <mark className="bg-yellow-400 text-black px-3 py-1 rounded-lg shadow-sm">
                        {t('price')} {product.price}/-
                      </mark>
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      {translateCondition(product.condition)}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center text-gray-600">
                    <PlaceIcon className="mr-2" />
                    <span>{translateLocation(getFirstTwoWords(product.location.readable))}</span>
                  </div>
                  <button
                    className="mt-6 w-full bg-gradient-to-r from-yellow-400 to-yellow-500 py-3 rounded-lg font-bold text-black shadow-md hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 flex items-center justify-center"
                    onClick={() => {
                      navigate(`/product/${product._id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <ViewTimelineIcon className="mr-2" />
                    {t("viewDetails")}
                  </button>
                  <button type="button" onClick={() => handleChatClick(ad)} className="w-full flex items-center justify-center gap-2 focus:outline-none text-black font-semibold bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 mt-5 rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
  <BiMessageDetail className="text-lg" />
  {t("chatWithSeller")}
</button>
                </div>
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
              <div key={product._id} className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.model}
                  className="w-full h-56 object-cover transform hover:scale-105 transition-transform duration-300"
                />
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">
                      {product.brand} {product.model}
                    </h3>
                    <button
                      className="bg-yellow-400 p-2 rounded-full shadow-lg hover:bg-yellow-500 transition-colors duration-200"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCartIcon className="text-black" />
                    </button>
                  </div>
                  <p className="text-gray-600 mt-4 line-clamp-3">
                    {truncateDescription(product.description, 50, 3)}
                  </p>
                  <div className="mt-6 flex justify-between items-center">
                    <p className="text-xl font-bold text-gray-900">
                      <mark className="bg-yellow-400 text-black px-3 py-1 rounded-lg shadow-sm">
                        {t('price')} {product.price}/-
                      </mark>
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      {translateCondition(product.condition)}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center text-gray-600">
                    <PlaceIcon className="mr-2" />
                    <span>{translateLocation(getFirstTwoWords(product.location.readable))}</span>
                  </div>
                  <button
                    className="mt-6 w-full bg-gradient-to-r from-yellow-400 to-yellow-500 py-3 rounded-lg font-bold text-black shadow-md hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 flex items-center justify-center"
                    onClick={() => {
                      navigate(`/product/${product._id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <ViewTimelineIcon className="mr-2" />
                    {t("viewDetails")}
                  </button>
                  <button type="button" onClick={() => handleChatClick(ad)} className="w-full flex items-center justify-center gap-2 focus:outline-none text-black font-semibold bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 mt-5 rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
  <BiMessageDetail className="text-lg" />
  {t("chatWithSeller")}
</button>
                </div>
              </div>
            ))}
        </>
      )}
    </>
  ) : (
    <div className="col-span-3 text-center text-gray-500 py-10">
      No other products available.
    </div>
  )}
</div>
        </div>
    );
};

export default ProductDetails;