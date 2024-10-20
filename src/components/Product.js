import React, { useRef, useState, useEffect } from "react";
import { FaStar, FaComments } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Divider from "@mui/material/Divider";
import { Link, useParams } from 'react-router-dom';
import { RxAvatar } from "react-icons/rx";
import { Button, IconButton, Grid, Tooltip, Snackbar } from "@mui/material"; // Import Snackbar
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import useAxiosInstance from '../ContextAPI/AxiosInstance';

// Utility function to get the first two words of a location
const getFirstTwoWords = (location) => {
  if (!location) return "";
  const words = location.split(" ");
  return words.length > 1 ? `${words[0]} ${words[1]}` : words[0]; // Return first two words or less
};

const Product = () => {
  const axiosInstance = useAxiosInstance(); 
  const sliderRef = useRef(null);
  const [ads, setAds] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const { adId } = useParams();

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
  }, []);

  const groupedAds = ads.reduce((acc, ad) => {
    if (!acc[ad.category]) {
      acc[ad.category] = [];
    }
    acc[ad.category].push(ad);
    return acc;
  }, {});

  const handleAddToCart = async (ad) => {
    const token = localStorage.getItem("token"); // Assuming you're storing JWT in local storage
    try {
      const response = await axiosInstance.post("/usercart/item/shopping", {
        adId: ad._id,
        brand: ad.brand,
        model: ad.model,
        price: ad.price,
        condition: ad.condition,
        location: ad.location,
        quantity: 1, // Default quantity is 1
        images: ad.images,
      });
    
      // Handle the response if needed
    } catch (error) {
      // Handle the error if needed
      console.error("Error adding item to cart:", error);
    }
    
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
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
          dots: true,
        },
      },
    ],
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="container bg-gray-50 mx-auto px-4 py-8">
      <hr className="border-t-2 border-gray-200 mb-8" />

      {Object.keys(groupedAds).map((category) => (
        <div key={category}>
          <h3 className="mb-8 mt-10 text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
            <mark className="px-2 text-white bg-yellow-400 rounded dark:bg-yellow-500">
              {category}
            </mark>
          </h3>

          <div className="flex justify-end items-center mb-4">
            <Button
              variant="contained"
              color="primary"
              className="text-black font-semibold"
              style={{ backgroundColor: "#FFC107" }}
            >
              View All
            </Button>
          </div>

          <Slider ref={(slider) => (sliderRef.current = slider)} {...settings}>
  {groupedAds[category].length > 0 ? (
    groupedAds[category].map((ad) => (
      <div key={ad._id} className="px-4">
        {/* Card Wrapper for Overall Click */}
        <div className="p-6 bg-white shadow-md rounded-lg transition-transform transform hover:scale-105 duration-200">
          <Link to={`/product/${ad._id}`}>
            <img
              src={ad.images[0]}
              alt={`${ad.model} image`}
              className="w-full h-48 object-cover rounded-t-lg mb-4"
            />
            <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">
              <span className="text-yellow-500">{ad.brand} </span>
              {ad.model}
            </h5>
          </Link>

          <Divider className="bg-gray-400 h-0.5 mb-6" />

          <Grid container alignItems="center">
            <Grid item xs>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ${ad.price}
              </span>
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
                        e.stopPropagation(); // Prevent Link click
                        handleAddToCart(ad); // Pass the full ad object
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
              <div>
                <span className="text-sm text-gray-500">
                  Location: {getFirstTwoWords(ad.location.readable)}
                </span>
              </div>
            )}

            <h5 className="text-sm text-gray-900">
              <span>Condition: {ad.condition}</span>
            </h5>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outlined"
              startIcon={<FaComments />}
              style={{ color: "#FFC107", borderColor: "#FFC107" }}
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
      ))}

      {/* Snackbar for success message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
};

export default Product;
