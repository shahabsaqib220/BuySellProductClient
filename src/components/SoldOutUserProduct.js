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
  Typography,
  Button
} from '@mui/material';
import useAxiosInstance from '../ContextAPI/AxiosInstance'; 
import UserNavbar from './UserNavbar';

const AdsTable = () => {
  const [ads, setAds] = useState([]);
  const [totalAds, setTotalAds] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const axiosInstance = useAxiosInstance(); // Get the Axios instance with token

  const fetchAds = async (page) => {
  
    try {
      const response = await axiosInstance.get(`/updated/user/solded/items`, {
        params: {
          page: page + 1,
          limit: rowsPerPage,
        },
      });
      
      setAds(response.data.ads);
      setTotalAds(response.data.totalAds);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  useEffect(() => {
    fetchAds(page);
  }, [page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };





  return (
    <>
    <UserNavbar/>
    <Paper>
       <h3 className="text-xl mt-4  ml-2 mb-4 font-semibold leading-none tracking-tight text-gray-900 md:text-xl lg:text-xl ">
        Your <mark className="px-2 text-gray-900 bg-yellow-400 rounded ">Sold Out </mark> Products
        </h3>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className='bg-yellow-400 font-sm mb-5 text-black'>
              <TableCell>Category</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Price</TableCell>
              
              <TableCell>Condition</TableCell>
              
            </TableRow>
          </TableHead>
          <TableBody>
            {ads.map((ad) => (
              <TableRow key={ad._id}>
                <TableCell>{ad.category}</TableCell>
                <TableCell>{ad.brand}</TableCell>
                <TableCell>{ad.model}</TableCell>
                <TableCell>{ad.price}</TableCell>
             
                <TableCell>{ad.condition}</TableCell>
               
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={totalAds}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    </>
  );
};

export default AdsTable;
