import React, { useRef, useState, useEffect } from "react";
import { FaStar, FaComments } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Divider from "@mui/material/Divider";
import { Link, useParams } from "react-router-dom";

import TuneIcon from '@mui/icons-material/Tune';
import { RxAvatar } from "react-icons/rx";
import { Button,Skeleton ,IconButton, Grid, Tooltip, Snackbar, Alert, Typography } from "@mui/material"; // Import Snackbar and Alert
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import useAxiosInstance from "../ContextAPI/AxiosInstance";
import { useDispatch } from 'react-redux';
import { setUserAndAd } from '../Redux/usersChatSlice';
import { FaLocationDot } from "react-icons/fa6";
import { MdFilterNone } from "react-icons/md";
import { useTranslation, i18n } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../ContextAPI/AuthContext';
import { FaCrown } from "react-icons/fa";
import pakistanCities from "../utils/PakistanCities";
import categoryMapping from '../utils/CategoryMapping';


  const getFirstTwoWords = (location) => {
    if (!location) return "";
    const words = location.split(" ");
    return words.length > 1 ? `${words[0]} ${words[1]}` : words[0];
  };

const Product = ({ category }) => {
  const { user, isLoggedIn } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [loading, setLoading] = useState(true); // Add this line
  const [isExpanded , setIsExpanded] = useState(false);
  const [ads, setAds] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const axiosInstance = useAxiosInstance();
  const { t, i18n } = useTranslation();
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Snackbar severity (success, error, etc.)
  const { adId } = useParams();



  


  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await axiosInstance.get("/user-ads/all/ads");
        setAds(response.data);
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
  
    fetchAds();
  }, []);

  



  const sortAdsByPriority = (ads) => {
    return ads.sort((a, b) => {
      const aPriority = a.premium ? 3 : a.standard ? 2 : a.basic ? 1 : 0;
      const bPriority = b.premium ? 3 : b.standard ? 2 : b.basic ? 1 : 0;
      return bPriority - aPriority; // Sort in descending order
    });
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





  


  const handleViewAll = (category) => {
    navigate(`/category/${category}`); // Navigate to CategoryAds component
  };

  const groupedAds = ads.reduce((acc, ad) => {
    if (!acc[ad.category]) {
      acc[ad.category] = [];
    }
    acc[ad.category].push(ad);
    return acc;
  }, {});

  const handleAddToCart = async (ad) => {
    if (!isLoggedIn) {
      // User is not logged in
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

      // User is logged in and item added to cart
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

  const settings = {
    dots: false,
    infinite: false,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: false,
    arrows: false,
    dots: true, // We'll add custom arrows
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          dots: false,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          dots: false,
          speed: 800,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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


  const handleApplyCustomFilter = () => {
    navigate('/custom-filter'); // Navigate to the custom filter component
  };

  const handleChatClick = (ad) => {
    if (isLoggedIn && user) {
      // Dispatch Redux action
      dispatch(setUserAndAd({ user, ad }));
      navigate(`/chat`);
      const senderId = user?._id; // assuming `user` contains the logged-in user's ID
      const receiverId = ad?.userId?._id; // assuming `ad.userId` contains an object with an `_id` field
      if (!receiverId) {
        console.error("Receiver ID not found in ad.userId");
      }
    } else {
      setSnackbarMessage("Sign in to chat with the seller");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
    }
  };

  return (
    <div className="container bg-gray-50 mx-auto px-4 py-8">
      <hr className="border-t-2 border-gray-200 mb-8" />

      <Button
      variant="contained"
      onClick={handleApplyCustomFilter}
      sx={{
        backgroundColor: "#FFC107", // Yellow color
        color: "#000", // Black font color
        borderRadius: "8px", // Rounded corners
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow
        "&:hover": {
          backgroundColor: "#FFA000", // Darker yellow on hover
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)", // Deeper shadow on hover
        },
        fontWeight: "bold", // Bold text
        padding: "10px 20px", // Extra padding for a larger button
        display: "flex", // Use flex to align icon and text
        alignItems: "center", // Center items vertically
      }}
    >
      <TuneIcon style={{ marginRight: "8px" }} /> {/* Add margin for spacing */}
      {t("applyCustomFilter")} {/* Fetch and display the translated text */}
    </Button>

    
      {loading ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 {Array.from(new Array(8)).map((_, index) => (
   <div
     key={index}
     className="p-4 bg-white shadow-md rounded-lg transition-transform transform hover:scale-105 duration-200"
   >
     {/* Skeleton for Image */}
     <Skeleton
       variant="rectangular"
       width="100%"
       height={150}
       className="rounded-t-lg mb-4"
     />
     
     {/* Skeleton for Title */}
     <Skeleton variant="text" width="70%" height={20} className="mb-2" />

     {/* Skeleton for Subtitle */}
     <Skeleton variant="text" width="50%" height={18} className="mb-2" />

     {/* Skeleton for Additional Info */}
     <Skeleton variant="text" width="40%" height={16} className="mb-2" />
   </div>
 ))}
</div>

) : (
  Object.keys(groupedAds).map((category) => (
    <div key={category}>
      <h3 className=" mt-20 text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl lg:text-3xl">
      <mark className="px-6 text-gray-700 bg-yellow-400 rounded-lg">
            {t(`categories.${categoryMapping[category]}`)}
            {/* {category} */}
        </mark>
      </h3>

      <div className="flex font-semibold justify-end items-center mb-4">
  <Button
    variant="contained"
    color="#000000"
    style={{
      backgroundColor: "#FFC107",
      fontFamily: "Noto Nastaliq Urdu, Arial, sans-serif",
    }}
    onClick={() => handleViewAll(category)}
  >
    {t('viewAll')}
  </Button>
</div>

      <div className="relative">
        
        <Slider ref={sliderRef} {...settings}>
          {groupedAds[category] && groupedAds[category].length > 0 ? (
            sortAdsByPriority(groupedAds[category]).map((ad) => (
              <div key={ad._id} className="px-4">
                <div className="p-6 bg-white shadow-md rounded-lg transition-transform transform hover:scale-105 duration-200 relative">
                  {/* Display Premium, Standard, or Basic Tag */}
                  <div className="left-0 flex flex-col">
                    {ad.premium && (
                      <span className="bg-yellow-400 text-black font-semibold px-2 py-1 rounded flex items-center">
                        <FaCrown className="mr-1" /> Premium Featured Ad
                      </span>
                    )}
                    {ad.standard && (
                      <span className="bg-blue-500 text-white font-semibold px-2 py-1 rounded flex items-center">
                        <FaCrown className="mr-1" /> Standard Featured Ad
                      </span>
                    )}
                    {ad.basic && (
                      <span className="bg-green-500 text-white font-semibold px-2 py-1 rounded flex items-center">
                        <FaCrown className="mr-1" /> Basic Featured Ad
                      </span>
                    )}
                  </div>

                  <Link to={`/product/${ad._id}`}>
                    <img
                      src={ad.images[0]}
                      alt={`${ad.model} image`}
                      className="w-full h-48 object-cover rounded-t-lg mb-4 mt-8" // Added margin-top to create space for the tag
                    />
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 mb-2">
                      <span className="text-yellow-500">{ad.brand} </span>
                      {ad.model}
                    </h5>
                  </Link>

                  
                  <Divider className="bg-gray-400 h-0.5 mb-6" />

                  <Grid container alignItems="center">
                    <Grid item xs>
                      <h3 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl lg:text-2xl">
                        <mark className="px-2 text-black bg-yellow-400 rounded">
                        {t('price')} {ad.price}/-
                        </mark>
                      </h3>
                    </Grid>

                    <Grid item>
                      <Grid container alignItems="center" justifyContent="flex-end">
                        <Grid item>
                          <Tooltip title="Add to Cart">
                            <IconButton
                              color="primary"
                              style={{ color: "#FFC107", fontSize: "30px" }}
                              aria-label="add to cart"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(ad);
                              }}
                            >
                              <AddShoppingCartIcon style={{ fontSize: "30px" }} />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                        <Grid item>
                          {ad.userId?.profileImageUrl ? (
                            <img
                              src={ad.userId.profileImageUrl}
                              alt="User  profile"
                              className="w-10 h-10 rounded-full object-cover ml-2"
                            />
                          ) : (
                            <RxAvatar className="w-8 h-8 text-yellow-400 ml-2" />
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <div className="flex justify-between items-center mb-2">
                    {ad.location && (
                      <div className="flex items-center text-sm text-gray-500">
                        <FaLocationDot className="text-2xl text-yellow-500 mr-1" />
                        <span className="text-black font-semibold">    {translateLocation(getFirstTwoWords(ad.location.readable))}</span>
                      </div>
                    )}

                    <h5 className="text-sm font-semibold text-gray-900">
                      <span>{translateCondition(ad.condition)}</span>
                    </h5>
                  </div>
                  <Typography
            variant="body1"
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              WebkitLineClamp: 3, // Limit to 4 lines
              maxHeight: "6em", // Approximate height for 4 lines
            }}
          >
            {ad.description}
          </Typography>

                  <div className="flex justify-between items-center mt-4">
                  <Button
      onClick={() => handleChatClick(ad)}
      variant="contained"
      startIcon={<FaComments />}
      style={{
        color: "#000000", // Black text
        backgroundColor: "#FFC107", // Yellow background
        borderColor: "#FFC107", // Optional border to match background
        fontWeight: i18n.language === "ur" ? 700 : 700, // Semi-bold for Urdu
        borderRadius: "5px", // Rounded corners
        fontFamily: i18n.language === "ur" ? "Noto Nastaliq Urdu, sans-serif" : "Arial, sans-serif", // Urdu-specific font
      }}
      size="small"
    >
      {t("chatWithSeller")} {/* Dynamically translate */}
    </Button>

    <div className="flex font-semibold"> {t("forSale")}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">No ads available in this category.</div>
          )}
        </Slider>
      </div>
    </div>
  ))
)}


     
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Product;