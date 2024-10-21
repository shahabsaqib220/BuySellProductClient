import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Grid, Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import Divider from "@mui/material/Divider";
import useAxiosInstance from "../ContextAPI/AxiosInstance";
import { FaLocationDot } from "react-icons/fa6";
import {useAuth} from "../ContextAPI/AuthContext"; // Assuming you have an AuthContext to manage user authentication state

const CategoryAds = () => {
  const { isLoggedIn, logout, token } = useAuth();
  const { category } = useParams(); 
  const axiosInstance = useAxiosInstance();
   // Assuming this returns whether the user is logged in
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
      // If the user is not logged in, show a message
      setSnackbarMessage("Sign in to use your cart");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    // If user is logged in, proceed to add item to cart
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

      // Item successfully added to cart
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
        const response = await axiosInstance.get(`/ads/category/${category}`);
        setAds(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching category ads:", error);
        setLoading(false);
      }
    };

    fetchAdsByCategory();
  }, [category]);

  if (loading) {
    return (
      <div className="text-center my-8">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h3 className="mb-8 text-2xl font-bold">
  All Ads in{" "}
  <span className="bg-yellow-400 text-white px-2 py-1 rounded">
    {category}
  </span>
</h3>

      <Grid container spacing={4}>
        {ads.length > 0 ? (
          ads.map((ad) => (
            <Grid item xs={12} sm={6} md={4} key={ad._id}>
              <div className="p-6 bg-white shadow-md rounded-lg">
                <Link to={`/product/${ad._id}`}>
                  <img
                    src={ad.images[0]}
                    alt={`${ad.model} image`}
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                  />
                  <h5 className="text-xl font-semibold text-gray-900 mb-2">
                    <span className="text-yellow-500">{ad.brand}</span> {ad.model}
                  </h5>
                </Link>

                <Divider className="bg-gray-400 h-0.5 mb-4" />

                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-gray-900">
                    Rs {ad.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    Condition: {ad.condition}
                  </span>
                </div>

                {/* Container for Button and Location */}
                <div className="flex justify-between items-center">
  <Button
    variant="contained"
    style={{ backgroundColor: "#FFC107", color: "#000" }}
    onClick={() => handleAddToCart(ad)}
  >
    Add to Cart
  </Button>

  {/* Container for Location Icon and Text */}
  <div className="flex items-center text-sm text-gray-500">
    <FaLocationDot className="text-2xl text-yellow-500 mr-1" />
    <span>{getFirstTwoWords(ad.location.readable)}</span>
  </div>
</div>

              </div>
            </Grid>
          ))
        ) : (
          <div className="text-center py-4">No ads found for {category}.</div>
        )}
      </Grid>

      {/* Snackbar for displaying messages */}
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
