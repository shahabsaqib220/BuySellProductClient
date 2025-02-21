import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Grid, Button, CircularProgress, Snackbar, Alert, Skeleton } from "@mui/material";
import Divider from "@mui/material/Divider";
import useAxiosInstance from "../ContextAPI/AxiosInstance";
import { FaLocationDot } from "react-icons/fa6";
import pakistanCities from "../utils/PakistanCities";
import { useAuth } from "../ContextAPI/AuthContext"; 
import { FaCrown } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import categoryMapping from "../utils/CategoryMapping";
import { useNavigate } from "react-router-dom";

const getFirstTwoWords = (location) => {
  if (!location) return "";
  const words = location.split(" ");
  return words.length > 1 ? `${words[0]} ${words[1]}` : words[0];
};

const CategoryAds = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { category } = useParams(); 
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const axiosInstance = useAxiosInstance();

  const categoryKey = categoryMapping[category] || category;



  const MAX_CHARS_PER_LINE = 50; // Adjust based on your UI
const MAX_LINES = 3;

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

  const getFirstTwoWords = (location) => {
    if (!location) return "";
    const words = location.split(" ");
    return words[0]; // Return only the first word
  };

  const handleAddToCart = async (ad) => {
    if (!isLoggedIn) {
      setSnackbarMessage(t('signInToUseCart'));
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

      setSnackbarMessage(t("itemAddedToCart"));
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

  const truncateDescription = (description) => {
    const maxChars = MAX_CHARS_PER_LINE * MAX_LINES;
    return description.length > maxChars
      ? description.substring(0, maxChars) + "..."
      : description;
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
  

  return (
    <div className="container mx-auto px-4 py-8">
     <h3 className="mb-8 text-2xl font-bold">
      {t("allAdsIn")}{" "} 
      <span className="bg-yellow-400 text-gray-800 px-2 py-1 rounded">
        {t(`categories.${categoryKey}`)}
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
                      <FaCrown className="text-xl mr-2" /> {t("premiumFeaturedAd")}
                    </div>
                  )}
                  {ad.standard && !ad.premium && (
                    <div className="absolute top-0 left-0 w-full text-center bg-blue-500 text-white py-2 font-bold flex items-center justify-center rounded-t-lg">
                      <FaCrown className="text-xl mr-2" /> {t("standardFeaturedAd")}
                    </div>
                  )}
                  {ad.basic && !ad.premium && !ad.standard && (
                    <div className="absolute top-0 left-0 w-full text-center bg-green-500 text-white py-2 font-bold flex items-center justify-center rounded-t-lg">
                      <FaCrown className="text-xl mr-2" /> {t("basicFeaturedAd")}
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
                  <p className="text-md text-gray-800 ">
                  {truncateDescription(ad.description)}
                    </p>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl mt-2 font-bold text-gray-900">
                      <h3 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl lg:text-2xl">
                        <mark className="px-2 text-black bg-yellow-400 rounded">
                        {t('price')} {ad.price}/-
                        </mark>
                 
                      </h3>
                    </span>
                    <span className="text-sm text-black font-semibold">
                    {translateCondition(ad.condition)}
                    </span>
                   
                    
                  </div>

                  <div className="flex justify-between items-center">
                  <Button
  variant="contained"
  sx={{
    fontWeight: 700,  // Makes the font bolder
    fontSize: "0.8rem",
    backgroundColor: "#FFC107",
    color: "#000",
  }}
  onClick={() => handleAddToCart(ad)}
>
  {t("addToCart")}
</Button>


                    <div className="flex items-center text-sm text-black font-semibold">
                      <FaLocationDot className="text-2xl text-yellow-500 mr-1" />
                      <span>{t(`${translateLocation(ad.location)}`)}</span>
                    </div>
                  </div>
                  <button  onClick={() => handleChatClick(ad)}  className="focus:outline-none text-black mt-5 w-full text-semibold bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ">{t("contactSeller")}</button>
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
