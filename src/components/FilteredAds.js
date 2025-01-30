import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, MenuItem, Button,
  Grid, Tooltip, IconButton, Divider, Snackbar, Alert
} from '@mui/material';
import { useTranslation } from "react-i18next";
import { FaSearch } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { setUserAndAd } from '../Redux/usersChatSlice';
import { styled } from '@mui/material/styles';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useAuth } from '../ContextAPI/AuthContext';
import categoryMapping from '../utils/CategoryMapping';

import { FaCrown } from 'react-icons/fa';
import useAxiosInstance from "../ContextAPI/AxiosInstance";
import { FaComments } from 'react-icons/fa';
import Skeleton from '@mui/material/Skeleton';
import pakistanCities from "../utils/PakistanCities";
const FilterBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const FilterButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.contrastText,
  marginTop: theme.spacing(2),
  width: '100%',
  maxWidth: '200px',
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));
const getFirstTwoWords = (location) => {
  if (!location) return "";
  const words = location.split(" ");
  return words.length > 1 ? `${words[0]} ${words[1]}` : words[0];
};

const AdFilterComponent = () => {
  const [ads, setAds] = useState([]);
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { user, isLoggedIn } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const axiosInstance = useAxiosInstance();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(); // Translation hook
    const navigate = useNavigate();




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



  const MAX_CHARS_PER_LINE = 50; // Adjust based on your UI
const MAX_LINES = 3;

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get('/filtering/filtered-ads')
      .then((response) => {
        const { categories, locations, ads } = response.data;
        setCategories(categories);
        setLocations(locations);
        setAds(ads);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchFilteredAds = () => {
    const params = new URLSearchParams({
      category: selectedCategory,
      location: selectedLocation,
      minPrice,
      maxPrice
    });



    setLoading(true);
    axiosInstance
      .get('/filtering/filtered-ads', { params })
      .then((response) => {
        setAds(response.data.ads);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error filtering ads:', error);
        setLoading(false);
      });
  };

  const getFirstTwoWords = (text) => text.split(' ').slice(0, 2).join(' ');

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
      setSnackbarOpen (true);
    }
  };

  const sortedAds = ads.sort((a, b) => {
    if (a.premium && !b.premium) return -1;
    if (!a.premium && b.premium) return 1;
    if (a.standard && !b.standard) return -1;
    if (!a.standard && b.standard) return 1;
    return 0; // For basic and others, maintain original order
  });

  const truncateDescription = (description) => {
    const maxChars = MAX_CHARS_PER_LINE * MAX_LINES;
    return description.length > maxChars
      ? description.substring(0, maxChars) + "..."
      : description;
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
        setSnackbarMessage(t('signInToChat'));
  
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
      }
    };

  return (
    <FilterBox>
  <Box sx={{ textAlign: "center", mb: 3 }}>
      <Typography
        variant="h4"
        sx={{
          color: "black",
          fontWeight: 400,
          letterSpacing: "1.5px",
          textTransform: "none",
          lineHeight: 1.5,
          position: "relative",
          display: "inline-block",
        }}
      >
        {t("find_what_matters")}
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: "2px",
          backgroundColor: "#FFC107",
          margin: "0.5rem 0",
        }}
      />

      <Typography
        variant="h4"
        sx={{
          color: "black",
          fontWeight: 400,
          letterSpacing: "1.5px",
          textTransform: "none",
          lineHeight: 1.5,
        }}
      >
        {t("refine_your_search")}
      </Typography>
    </Box>

    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, width: "100%", justifyContent: "center" }}>
      {/* Category Dropdown */}
      <TextField
        label={t("category")}
        select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        sx={{ flex: "1 1 200px", minWidth: "200px" }}
        fullWidth
        variant="outlined"
      >
        <MenuItem value=""><em>{t("all_categories")}</em></MenuItem>
        {categories.map((category, index) => (
          <MenuItem key={index} value={category}> {t(`categories.${categoryMapping[category]}`)}</MenuItem>
        ))}
      </TextField>

      {/* Min Price */}
      <TextField
        label={t("min_price")}
        type="number"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        sx={{ flex: "1 1 100px", minWidth: "100px" }}
        fullWidth
        variant="outlined"
      />

      {/* Max Price */}
      <TextField
        label={t("max_price")}
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        sx={{ flex: "1 1 100px", minWidth: "100px" }}
        fullWidth
        variant="outlined"
      />

      {/* Cities Dropdown */}
      <TextField
        label={t("cities")}
        select
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
        sx={{ flex: "1 1 200px", minWidth: "200px" }}
        fullWidth
        variant="outlined"
      >
        <MenuItem value=""><em>{t("all_cities")}</em></MenuItem>
        {locations.map((location, index) => (
    <MenuItem key={index} value={location}>
      {t(`${translateLocation(location)}`)}
    </MenuItem>
  ))}
      </TextField>
    </Box>

      <FilterButton
        variant="contained"
        onClick={fetchFilteredAds}
        sx={{
          backgroundColor: '#FFC107',
          color: 'black',
          padding: '8px 16px',
          borderRadius: '4px',
          fontWeight: 500,
          textTransform: 'none',
          display: 'flex',
          alignItems: 'center',
          '&:hover': {
            backgroundColor: '#ffb300',
          },
          '&:focus': {
            outline: 'none',
          },
        }}
      >
        <FaSearch style={{ marginRight: '8px' }} />
        {t("search")}
      </FilterButton>

      {loading ? (
        <Grid container spacing={3} sx={{ marginTop: 3 }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" height={200} />
              <Skeleton variant="text" />
              <Skeleton variant="text" width="60%" />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3} sx={{ marginTop: 3 }}>
          {sortedAds.length > 0 ? sortedAds.map((ad, index) => (
           
            <Grid item xs={12} sm={6} md={4} key={index}>
              <div className="p-6 bg-white shadow-md rounded-lg transition-transform transform hover:scale-105 duration-200 relative">
  <Link to={`/product/${ad._id}`}>
    {/* Premium Tag */}
    {ad.premium && (
      <div className="absolute top-2 left-2 animate-light-switch-yellow bg-yellow-400 text-black py-1 px-3 rounded-full flex items-center gap-2 shadow-3xl">
        <FaCrown className="text-lg text-black" />
        <span className="font-semibold">{t("premiumFeaturedAd")}</span>
      </div>
    )}

    {/* Standard Tag */}
    {ad.standard && !ad.premium && (
      <div className="absolute top-2 left-2 animate-light-switch-blue bg-blue-500 text-white py-1 px-3 rounded-full flex items-center gap-2 shadow-3xl">
        <FaCrown className="text-lg text-white" />
        <span className="font-semibold">{t("standardFeaturedAd")}</span>
      </div>
    )}

    {/* Basic Tag */}
    {ad.basic && !ad.premium && !ad.standard && (
      <div className="absolute top-2 animate-light-switch-green left-2 bg-green-500 text-white py-1 px-3 rounded-full flex items-center gap-2 shadow-3xl">
        <FaCrown className="text-lg text-white" />
        <span className="font-semibold">{t("basicFeaturedAd")}</span>
      </div>
    )}

    {/* Ad Image */}
    <img
      src={ad.images[0]}
      alt={`${ad.model} image`}
      className="w-full h-48 object-cover rounded-lg"
    />
    <h5 className="text-xl font-semibold tracking-tight text-gray-900 mb-2">
      <span className="text-yellow-500">{ad.brand}</span> {ad.model}
    </h5>
    
  </Link>

  <Divider className="bg-gray-400 h-0.5 mb-6" />
  <p className="text-gray-500">
    {truncateDescription(ad.description)}
  </p>


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
      </Grid>
    </Grid>
  </Grid>

  <div className="flex justify-between items-center mb-2">
    {ad.location && (
      <div className="flex font-semibold items-center text-black">
        <FaLocationDot className="text-2xl text-yellow-500 mr-1" />
        <span> {t(`${translateLocation(ad.location.readable)}`)}</span>
      </div>
    )}
    <h5 className="text-sm text-black font-semibold">
      <span>{translateCondition(ad.condition)}</span>
    </h5>
  </div>

  <div className="flex justify-between items-center mt-4">
  <Button
  variant="contained"
  onClick={() => handleChatClick(ad)}
  startIcon={<FaComments />}
  style={{
    color: "#000000",
    backgroundColor: "#FFC107",
    borderColor: "#FFC107",
    fontWeight: "bold",  // Makes text bolder
    fontSize: "16px",     // Increases font size
    textTransform: "none" // Keeps original text case
  }}
  size="medium"
>
  {t("chatWithSeller")}
</Button>


    
  </div>
</div>

            </Grid>
          )) : (
            <Typography 
            variant="h5" 
            sx={{ 
              color: 'text.secondary', 
              fontWeight: 'bold', 
              textAlign: 'center', 
              mt: 5, 
              mb: 3 
            }}
          >
            {t("noAdsFound")}
          </Typography>
          )}
        </Grid>
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
    </FilterBox>
  );
};

export default AdFilterComponent;