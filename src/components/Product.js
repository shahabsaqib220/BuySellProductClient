import React, { useRef, useState, useEffect } from "react";
import { FaStar, FaComments } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Divider from "@mui/material/Divider";
import { Link, useParams } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import { Button, IconButton, Grid, Tooltip, Snackbar, Alert } from "@mui/material"; // Import Snackbar and Alert
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import useAxiosInstance from "../ContextAPI/AxiosInstance";
import { useDispatch } from 'react-redux';
import { setUserAndAd } from '../Redux/usersChatSlice';

import { FaLocationDot } from "react-icons/fa6";
import { MdFilterNone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../ContextAPI/AuthContext';


const getFirstTwoWords = (location) => {
  if (!location) return "";
  const words = location.split(" ");
  return words.length > 1 ? `${words[0]} ${words[1]}` : words[0];
};

const Product = () => {
  const { user, isLoggedIn } = useAuth();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const axiosInstance = useAxiosInstance();
  const sliderRef = useRef(null);
  const [ads, setAds] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Snackbar severity (success, error, etc.)
  const { adId } = useParams();

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axiosInstance.get("/user-ads/all/ads");
        setAds(response.data);
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchAds();
  }, []);


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
    dots:true, // We'll add custom arrows
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

  const handleApplyCustomFilter = () => {
    navigate('/custom-filter'); // Navigate to the custom filter component
  };

  const handleChatClick = (ad) => {
    if (isLoggedIn && user) {
   
      
      // Dispatch Redux action
      dispatch(setUserAndAd({ user, ad }));
  
     
  
      // navigate(`/chat/${user.id}/${ad.userId._id}`);
      navigate(`/chat`)
  
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
    backgroundColor: '#FFC107', // Yellow color
    color: '#000', // Black font color
    borderRadius: '8px', // Rounded corners
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow
    '&:hover': {
      backgroundColor: '#FFA000', // Darker yellow on hover
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)', // Deeper shadow on hover
    },
    fontWeight: 'bold', // Bold text
    padding: '10px 20px', // Extra padding for a larger button
    display: 'flex', // Use flex to align icon and text
    alignItems: 'center', // Center items vertically
  }}
>
  <MdFilterNone style={{ marginRight: '8px' }} /> {/* Add margin for spacing */}
  Apply Custom Filter
</Button>



      {Object.keys(groupedAds).map((category) => (
        <div key={category}>
          <h3 className="mb-8 mt-10 text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl lg:text-3xl">
            <mark className="px-2 text-white bg-yellow-400 rounded">
              {category}
            </mark>
          </h3>

          <div className="flex justify-end items-center mb-4">
          <Button
              variant="contained"
              color="primary"
              onClick={() => handleViewAll(category)}
              style={{ backgroundColor: "#FFC107" }}
            >
              View All
            </Button>
          </div>
          <div className="relative">
      

      {/* Slider */}
      <div className="relative">
      {/* Custom Previous Button */}
     

      {/* Slider */}
      <Slider ref={sliderRef} {...settings}>
        {groupedAds[category] && groupedAds[category].length > 0 ? (
          groupedAds[category].map((ad) => (
            <div key={ad._id} className="px-4">
              <div className="p-6 bg-white shadow-md rounded-lg transition-transform transform hover:scale-105 duration-200">
                <Link to={`/product/${ad._id}`}>
                  <img
                    src={ad.images[0]}
                    alt={`${ad.model} image`}
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                  />
                  <h5 className="text-xl font-semibold tracking-tight text-gray-900 mb-2">
                    <span className="text-yellow-500">{ad.brand} </span>
                    {ad.model}
                  </h5>
                </Link>

                <Divider className="bg-gray-400 h-0.5 mb-6" />

                <Grid container alignItems="center">
                  <Grid item xs>
                  <h3 className=" text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl lg:text-2xl">
            <mark className="px-2 text-black bg-yellow-400 rounded">
              Rs {ad.price}/-
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
                            alt="User profile"
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
                      <span className="text-black font-semibold">{getFirstTwoWords(ad.location.readable)}</span>
                    </div>
                  )}

                  <h5 className="text-sm font-semibold text-gray-900">
                    <span>{ad.condition}</span>
                  </h5>
                </div>

                <div className="flex justify-between items-center mt-4">
                <Button
                onClick={() => handleChatClick(ad)}
  variant="contained"
  startIcon={<FaComments />}
  style={{
    color: "#000000", // Black text
    backgroundColor: "#FFC107", // Yellow background
    borderColor: "#FFC107", // Optional border to match background
  }}
  size="small"
>
  Chat with Seller
</Button>

                  <div className="flex">In Stock</div>
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
        </div>
      ))}

      {/* Snackbar for notifications */}
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
