import React, { useEffect, useState } from 'react';
import useAxiosInstance from '../ContextAPI/AxiosInstance'; // Use your custom hook
import { Container, Grid, Card, CardContent, Typography, Pagination, CardMedia, Box } from '@mui/material';

const AdsList = () => {
  const axiosInstance = useAxiosInstance(); // Call the custom Axios instance hook
  const [ads, setAds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const adsPerPage = 8; // Display 8 ads per page (4 per row, 2 rows)

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
    <Container sx={{ paddingY: 10 }}>
      <Typography variant="h4" gutterBottom align="left" sx={{ fontWeight: 600, color: '#333' }}>
        Your Live Ads
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : ads.length === 0 ? (
        <Typography variant="h6" align="center" color="text.secondary">
          You don't have any ads to display.
        </Typography>
      ) : (
        <>
          <Grid container spacing={2} justifyContent="center">
            {ads.map((ad) => (
              <Grid item xs={12} sm={6} md={3} key={ad._id} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card sx={{ width: 200, height: 200, display: 'flex', flexDirection: 'column', boxShadow: 3, borderRadius: 2 }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={ad.images.length > 0 ? ad.images[0] : 'default-image.jpg'}
                    alt={`${ad.brand} ${ad.model}`}
                    sx={{ objectFit: 'cover', flexGrow: 1 }} // Maintain aspect ratio
                  />
                  <CardContent sx={{ padding: 1 }}>
                    <Box>
                      <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                        {ad.category} - {ad.brand}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {ad.model}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#00796b', fontWeight: 600, marginTop: 0.5 }}>
                      ${ad.price}
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
    </Container>
  );
};

export default AdsList;
