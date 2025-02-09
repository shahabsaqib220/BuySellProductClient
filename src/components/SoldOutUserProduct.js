import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Skeleton,
  Typography
} from '@mui/material';
import useAxiosInstance from '../ContextAPI/AxiosInstance'; 
import UserNavbar from './UserNavbar';
import {useTranslation} from "react-i18next";

const AdsTable = () => {
  const { t } = useTranslation();
  const [ads, setAds] = useState([]);
  const [totalAds, setTotalAds] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true); // Loading state
  const axiosInstance = useAxiosInstance(); 

  const fetchAds = async (page) => {
    setLoading(true); // Set loading before fetching data
    try {
      const response = await axiosInstance.get(`/updated/user/solded/items`, {
        params: { page: page + 1, limit: rowsPerPage },
      });
      setAds(response.data.ads);
      setTotalAds(response.data.totalAds);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false); // Stop loading after fetching
    }
  };

  useEffect(() => {
    fetchAds(page);
  }, [page]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <UserNavbar />
      <Paper className="p-4">
       <Typography variant="h5" className="font-semibold text-gray-900 mb-4">
      {t("your")}{" "}
      <mark className="px-2 text-gray-900 bg-yellow-400 rounded">
        {t("soldOut")}
      </mark>{" "}
      {t("products")}
    </Typography>

        {loading ? (
          // Show skeleton when loading
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className='bg-yellow-400 text-black'>
                  <TableCell>Category</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Model</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Condition</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell><Skeleton variant="text" width={120} /></TableCell>
                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : ads.length === 0 ? (
          // Show message when no sold-out products
          <Typography className="text-center text-gray-600 mt-4">
      {t("noSoldOutProduct")}
    </Typography>
        ) : (
          // Show table when data is available
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className='bg-yellow-400 text-black'>
                  <TableCell> {t("category")}</TableCell>
                  <TableCell> {t("brand")}</TableCell>
                  <TableCell> {t("model")}</TableCell>
                  <TableCell> {t("price")}</TableCell>
                  <TableCell> {t("condition")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ads.map((ad) => (
                  <TableRow key={ad._id}>
                    <TableCell>{ad.category}</TableCell>
                    <TableCell>{ad.brand}</TableCell>
                    <TableCell>{ad.model ? ad.model : "Model not specified"}</TableCell>
                    <TableCell>{ad.price}</TableCell>
                    <TableCell>{ad.condition}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {!loading && ads.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={totalAds}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
    </>
  );
};

export default AdsTable;
