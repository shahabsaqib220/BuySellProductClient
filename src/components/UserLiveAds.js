import React, { useEffect, useState } from 'react';
import useAxiosInstance from '../ContextAPI/AxiosInstance'; // Use your custom hook
import { Container, Grid, Card, CardContent, Typography, Pagination, CardMedia, Box, Skeleton } from '@mui/material';

const AdsList = () => {
  const axiosInstance = useAxiosInstance(); // Call the custom Axios instance hook
  const [ads, setAds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const adsPerPage = 8; // Display 5 ads per page (5 per row)

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/viewsads/myads?page=${currentPage}&limit=${adsPerPage}`);
        setAds(response.data.ads);
        setTotalPages(Math.ceil(response.data.totalAds / adsPerPage)); // Assume backend returns total ads count
      } catch (error) {
        console.error('Error fetching ads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [axiosInstance, currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 400, color: '#333', textAlign: 'left', marginBottom: 10, marginLeft: 3 }}
      >
        Your Live Ads
      </Typography>

      {loading ? (
        <Grid container spacing={2} justifyContent="center">
          {Array.from(new Array(5)).map((_, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={index}> {/* md={2.4} ensures 5 cards per row */}
              <Skeleton variant="rectangular" width={250} height={250} />
            </Grid>
          ))}
        </Grid>
      ) : ads.length === 0 ? (
        <Typography variant="h6" align="center" color="text.secondary">
          You don't have any ads to display.
        </Typography>
      ) : (
        <>
          <Grid container spacing={1.5} justifyContent="center"> {/* Adjust spacing to reduce space between cards */}
            {ads.map((ad) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={2.4} 
                key={ad._id}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginX: { xs: 0, sm: 0.5 }, // Minimal margin on sides
                }}
              >
                <Card
                  sx={{
                    width: 250,
                    height: 300,
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 6,
                    borderRadius: 3,
                  }}
                >
                  <CardMedia
                    component="img"
                    image={ad.images.length > 0 ? ad.images[0] : 'default-image.jpg'}
                    alt={`${ad.brand} ${ad.model}`}
                    sx={{
                      height: 180, // Enforces a fixed height for the image
                      width: '100%', // Ensures the image takes the full width of the card
                      objectFit: 'cover', // Ensures the image is cropped to fit within the given height without distorting aspect ratio
                    }}
                  />
                  <CardContent sx={{ padding: 2, textAlign: 'center' }}>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '0.95rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                     Catagory: {ad.category}
                    </Typography>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '0.95rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                     Brand: {ad.brand}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {ad.model}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: '1rem', color: '#00796b', fontWeight: 600, marginTop: 1 }}
                    >
                      Rs. {ad.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{ marginTop: 4, display: 'flex', justifyContent: 'center' }}
          />
        </>
      )}
    </>
  );
};

export default AdsList;
