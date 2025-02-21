import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Snackbar from '@mui/material/Snackbar';
import CrownIcon from '@mui/icons-material/Star';
import Alert from '@mui/material/Alert';
import useAxiosInstance from "../ContextAPI/AxiosInstance";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Skeleton,
  Box,
  Chip,
  IconButton,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import pakistanCities from "../utils/PakistanCities";
import ChatIcon from "@mui/icons-material/Chat";
import { useAuth } from '../ContextAPI/AuthContext';
import { useDispatch } from 'react-redux';
import { setUserAndAd } from '../Redux/usersChatSlice';
import { useNavigate } from "react-router-dom";
import { useTranslation, i18n } from "react-i18next";
import LocationOnIcon from "@mui/icons-material/LocationOn";  // Location icon
import { motion } from "framer-motion";

const SearchResults = () => {
  const searchTerm = useSelector((state) => state.search.term);
  const axiosInstance = useAxiosInstance();
  const { user, isLoggedIn } = useAuth();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChatClick = (product) => {
    if (isLoggedIn && user) {
      dispatch(setUserAndAd({ user, product }));
      navigate(`/chat`);
      const senderId = user?._id;
      const receiverId = product?.userId?._id;
      if (!receiverId) {
        console.error("Receiver ID not found in ad.userId");
      }
    } else {
      setSnackbarMessage(t('signInToChat'));
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
    }
  };

  const handleAddToCart = async (product) => {
    if (!isLoggedIn) {
      setSnackbarMessage(t('signInToUseCart'));
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    try {
      await axiosInstance.post('/filtering/user/cart', {
        adId: product._id,
        brand: product.brand,
        model: product.model,
        price: product.price,
        condition: product.condition,
        location: product.location,
        quantity: 1,
        images: product.images,
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
    if (searchTerm) {
      const fetchSearchResults = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get(`/filtering/search?term=${searchTerm}`);
          const sortedResults = response.data.sort((a, b) => b.premium - a.premium);
          setSearchResults(sortedResults);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
        setLoading(false);
      };

      fetchSearchResults();
    }
  }, [searchTerm]);

  const handleViewDetailClick = async (product) => {
    navigate(`/product/${product._id}`);
  };

  const translateLocation = (location) => {
    const formattedLocation = location
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^\w_]/g, "");

    if (pakistanCities.includes(formattedLocation)) {
      return t(formattedLocation);
    }

    return location;
  };

  const translateCondition = (condition) => {
    const normalizeKey = (key) => key.trim().toLowerCase().replace(/ +/g, ' ');

    const conditions = {
      [normalizeKey("used")]: t("used"),
      [normalizeKey("brand new")]: t("brand new"),
      [normalizeKey("refurbished")]: t("refurbished"),
    };

    const normalizedCondition = normalizeKey(condition);
    return conditions[normalizedCondition] || condition;
  };

  return (
    <>
      <Container sx={{ mt: 4 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", mb: 3, color: "text.primary", textAlign: "center" }}
        >
          Search Results for "{searchTerm}"
        </Typography>

        {loading ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ maxWidth: 350, boxShadow: 3 }}>
                  <Skeleton variant="rectangular" height={150} animation="wave" />
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={30} animation="wave" />
                    <Skeleton variant="text" width="40%" height={20} animation="wave" />
                    <Skeleton variant="text" width="30%" height={20} animation="wave" />
                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                      <Skeleton variant="rectangular" width={120} height={40} animation="wave" />
                      <Skeleton variant="rectangular" width={120} height={40} animation="wave" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : searchResults.length === 0 ? (
          <Typography
            variant="h6"
            sx={{ color: "error.main", textAlign: "center", mt: 4 }}
          >
            No Products Found
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {searchResults.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    sx={{
                      width: 350, // Fixed width
                      height: 550, // Fixed height
                      boxShadow: 3,
                      borderRadius: 2,
                      transition: "transform 0.3s, box-shadow 0.3s",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    {product.premium && (
                      <Box
                        sx={{
                          position: "relative",
                          backgroundColor: "gold",
                          padding: "5px 10px",
                          borderRadius: "4px",
                          zIndex: 1,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <CrownIcon sx={{ color: "black", marginRight: 1 }} />
                        <Typography variant="body2" sx={{ color: "black", fontWeight: "bold" }}>
                          {t("premiumFeaturedAd")}
                        </Typography>
                      </Box>
                    )}

                    <CardMedia
                      component="img"
                      sx={{
                        height: 200, // Fixed height for the image
                        objectFit: "cover", // Ensures the image covers the area without distortion
                        borderRadius: "8px 8px 0 0",
                      }}
                      image={product.images[0] || "https://via.placeholder.com/300"}
                      alt={product.model}
                    />

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <IconButton
                          sx={{ mr: 1, color: "primary.main" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                        >
                          <ShoppingCartIcon />
                        </IconButton>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", color: "text.primary" }}
                        >
                          {product.brand} {product.model}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Chip
                          label={product.category}
                          size="small"
                          sx={{ mr: 2, bgcolor: "primary.light", color: "primary.contrastText" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {translateCondition(product.condition)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            color: "text.primary",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            marginRight: 5,
                          }}
                        >
                          {t('price')} {product.price}/-
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LocationOnIcon sx={{ color: "text.secondary", mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {t(`${(product.location)}`)}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 3,
                          }}
                        >
                          {product.description}
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<ChatIcon />}
                          sx={{
                            backgroundColor: "primary.main",
                            color: "white",
                            "&:hover": { backgroundColor: "primary.dark" },
                          }}
                          onClick={() => handleChatClick(product)}
                        >
                          {t("chatWithSeller")}
                        </Button>
                        <Button
                          variant="outlined"
                          sx={{
                            borderColor: "primary.main",
                            color: "primary.main",
                            "&:hover": { borderColor: "primary.dark", color: "primary.dark" },
                          }}
                          onClick={() => handleViewDetailClick(product)}
                        >
                          {t("viewDetails")}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SearchResults;