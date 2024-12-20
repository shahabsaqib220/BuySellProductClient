import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, MenuItem, Button,
  Grid, Tooltip, IconButton, Divider, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import { FaLocationDot } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useAuth } from '../ContextAPI/AuthContext';
import useAxiosInstance from "../ContextAPI/AxiosInstance";
import { FaComments } from 'react-icons/fa';
import { RxAvatar } from 'react-icons/rx';
import axiosInstance from '../ContextAPI/AxiosInstance';

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

const AdFilterComponent = () => {

  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { user, isLoggedIn } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const axiosInstance = useAxiosInstance();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Snackbar severity (success, error, etc.)

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
    }
  );

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
  }; const [loading, setLoading] = useState(true);

  const getFirstTwoWords = (text) => text.split(' ').slice(0, 2).join(' ');

  


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


  return (
    <FilterBox>

<Box sx={{ textAlign: 'center', mb: 3 }}>
  <Typography
    variant="h4"
    sx={{
      color: 'black', // Set the text color to black
      fontWeight: 400, // Slightly bolder font weight
      letterSpacing: '1.5px', // Spacing between letters
      textTransform: 'none', // Normal text case (not all caps)
      lineHeight: 1.5, // Improved line height for readability
      position: 'relative', // For positioning the line
      display: 'inline-block', // Makes the line position relative to the text
    }}
  >
    Find What Matters Most
  </Typography>
  
  <Box
    sx={{
      width: '100%', // Full width of the container
      height: '2px', // Height of the line
      backgroundColor: '#FFC107', // Yellow color
      margin: '0.5rem 0', // Space above and below the line
    }}
  />

  <Typography
    variant="h4"
    sx={{
      color: 'black', // Set the text color to black
      fontWeight: 400, // Slightly bolder font weight
      letterSpacing: '1.5px', // Spacing between letters
      textTransform: 'none', // Normal text case (not all caps)
      lineHeight: 1.5, // Improved line height for readability
    }}
  >
    Refine Your Search Experience
  </Typography>
</Box>



      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, width: '100%', justifyContent: 'center' }}>
        <TextField
          label="Category"
          select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          sx={{ flex: '1 1 200px', minWidth: '200px' }}
          fullWidth
          variant="outlined"
        >
          <MenuItem value=""><em>All Categories</em></MenuItem>
          {categories.map((category, index) => (
            <MenuItem key={index} value={category}>{category}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Min Price"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          sx={{ flex: '1 1 100px', minWidth: '100px' }}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Max Price"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          sx={{ flex: '1 1 100px', minWidth: '100px' }}
          fullWidth
          variant="outlined"
        />

        <TextField
          label="Cities"
          select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          sx={{ flex: '1 1 200px', minWidth: '200px' }}
          fullWidth
          variant="outlined"
        >
          <MenuItem value=""><em>All Cities</em></MenuItem>
          {locations.map((location, index) => (
            <MenuItem key={index} value={location}>{location}</MenuItem>
          ))}
        </TextField>
      </Box>




      

      <FilterButton
  variant="contained"
  onClick={fetchFilteredAds}
  sx={{
    backgroundColor: '#FFC107', // Yellow background
    color: 'black', // Black text color
    padding: '8px 16px', // Adjust padding as necessary
    borderRadius: '4px', // Rounded corners
    fontWeight: 500, // Medium font weight
    textTransform: 'none', // Normal text case (not all caps)
    display: 'flex', // Flexbox for icon and text alignment
    alignItems: 'center', // Center the icon vertically
    '&:hover': {
      backgroundColor: '#ffb300', // Darker yellow on hover
    },
    '&:focus': {
      outline: 'none', // Remove focus outline
    },
  }}
>
  <FaSearch style={{ marginRight: '8px' }} /> {/* Add margin for spacing */}
  Search
</FilterButton>


      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ marginTop: 3 }}>
          {ads.length > 0 ? ads.map((ad, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
                  
                    </Grid>
                  </Grid>
                </Grid>

                <div className="flex justify-between items-center mb-2">
                  {ad.location && (
                    <div className="flex font-semibold items-center  text-black">
                      <FaLocationDot className="text-2xl text-yellow-500 mr-1" />
                      <span>{getFirstTwoWords(ad.location.readable)}</span>
                    </div>
                  )}

                  <h5 className="text-sm text-black font-semibold">
                    <span>{ad.condition}</span>
                  </h5>
                </div>

                <div className="flex justify-between items-center mt-4">
                <Button
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
            We're sorry, but no ads matched your criteria.
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
