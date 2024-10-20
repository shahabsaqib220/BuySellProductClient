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

const getFirstTwoWords = (location) => {
  if (!location) return "";
  const words = location.split(" ");
  return words.length > 1 ? `${words[0]} ${words[1]}` : words[0];
};

const Product = () => {
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
        const response = await axiosInstance.get("/allads/ads");
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
    const token = localStorage.getItem("token");

    if (!token) {
      // User is not logged in
      setSnackbarMessage("Sign in to use your cart");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    try {
      await axiosInstance.post("/usercart/item/shopping", {
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
      setSnackbarMessage("Item added to cart");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      setSnackbarMessage("Failed to add item to cart");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
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
          <h3 className="mb-8 mt-10 text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl lg:text-3xl">
            <mark className="px-2 text-white bg-yellow-400 rounded">
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
                        <span className="text-2xl font-bold text-gray-900">
                          Rs {ad.price}
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
