import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Grid, Button, CircularProgress, Snackbar, Alert, Skeleton } from "@mui/material";
import Divider from "@mui/material/Divider";
import useAxiosInstance from "../ContextAPI/AxiosInstance";
import { FaLocationDot } from "react-icons/fa6";
import { useAuth } from "../ContextAPI/AuthContext"; // Assuming you have an AuthContext to manage user authentication state
import { FaCrown } from "react-icons/fa";

const CategoryAds = () => {
  const { isLoggedIn } = useAuth();
  const { category } = useParams(); 
  const axiosInstance = useAxiosInstance();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const getFirstTwoWords = (location) => {
    if (!location) return "";
    const words = location.split(" ");
    return words[0]; // Return only the first word
  };

  const handleAddToCart = async (ad) => {
    if (!isLoggedIn) {
      setSnackbarMessage("Sign in to use your cart");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    try {
      await axiosInstance.post("/filtering/user/cart", {
        adId: ad._id,
        brand: ad.brand,
        model: ad.model,
        price: ad.price,
        condition: ad.condition,
        location: ad.location,
        quantity: 1,
        images: ad.images,
      });

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

  useEffect(() => {
    const fetchAdsByCategory = async () => {
      try {
        const response = await axiosInstance.get(`/product/details/${category}`);
        const allAds = response.data;

        const premiumAds = allAds.filter((ad) => ad.premium);
        const standardAds = allAds.filter((ad) => ad.standard && !ad.premium);
        const basicAds = allAds.filter((ad) => ad.basic && !ad.premium && !ad.standard);
        const others = allAds.filter((ad) => !ad.premium && !ad.standard && !ad.basic);

        setAds([...premiumAds, ...standardAds, ...basicAds, ...others]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching category ads:", error);
        setLoading(false);
      }
    };

    fetchAdsByCategory();
  }, [category]);

  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <div className="relative p-6 bg-white shadow-md rounded-lg">
          <Skeleton variant="rectangular" height={28} className="mb-4" />
          <Skeleton variant="rectangular" height={192} className="mb-4" />
          <Skeleton variant="text" width="80%" className="mb-2" />
          <Skeleton variant="text" width="60%" className="mb-4" />
          <Skeleton variant="text" width="50%" />
        </div>
      </Grid>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h3 className="mb-8 text-2xl font-bold">
        All Ads in{" "}
        <span className="bg-yellow-400 text-gray-800 px-2 py-1 rounded">
          {category}
        </span>
      </h3>

      <Grid container spacing={4}>
        {loading
          ? renderSkeletons()
          : ads.length > 0
          ? ads.map((ad) => (
              <Grid item xs={12} sm={6} md={4} key={ad._id}>
                <div className="relative p-6 bg-white shadow-md rounded-lg">
                  {/* Tag for Ad Type */}
                  {ad.premium && (
                    <div className="absolute top-0 left-0 w-full text-center bg-yellow-400 text-black py-2 font-bold flex items-center justify-center rounded-t-lg">
                      <FaCrown className="text-xl mr-2" /> Premium Featured Ad
                    </div>
                  )}
                  {ad.standard && !ad.premium && (
                    <div className="absolute top-0 left-0 w-full text-center bg-blue-500 text-white py-2 font-bold flex items-center justify-center rounded-t-lg">
                      <FaCrown className="text-xl mr-2" /> Standard Featured Ad
                    </div>
                  )}
                  {ad.basic && !ad.premium && !ad.standard && (
                    <div className="absolute top-0 left-0 w-full text-center bg-green-500 text-white py-2 font-bold flex items-center justify-center rounded-t-lg">
                      <FaCrown className="text-xl mr-2" /> Basic Featured Ad
                    </div>
                  )}

                  <Link to={`/product/${ad._id}`}>
                    <img
                      src={ad.images[0]}
                      alt={`${ad.model} image`}
                      className="w-full h-48 object-cover rounded-t-lg mb-4 mt-6"
                    />
                    <h5 className="text-xl font-semibold text-gray-900 mb-2">
                      <span className="text-yellow-500">{ad.brand}</span>{" "}
                      {ad.model}
                    </h5>
                  </Link>

                  <Divider className="bg-gray-400 h-0.5 mb-4" />

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl mt-2 font-bold text-gray-900">
                      <h3 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl lg:text-2xl">
                        <mark className="px-2 text-black bg-yellow-400 rounded">
                          Rs {ad.price}/-
                        </mark>
                      </h3>
                    </span>
                    <span className="text-sm text-black font-semibold">
                      {ad.condition}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "#FFC107", color: "#000" }}
                      onClick={() => handleAddToCart(ad)}
                    >
                      Add to Cart
                    </Button>

                    <div className="flex items-center text-sm text-black font-semibold">
                      <FaLocationDot className="text-2xl text-yellow-500 mr-1" />
                      <span>{getFirstTwoWords(ad.location?.readable)}</span>
                    </div>
                  </div>
                </div>
              </Grid>
            ))
          : (
            <div className="text-center py-4">No ads found for {category}.</div>
          )}
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CategoryAds;
