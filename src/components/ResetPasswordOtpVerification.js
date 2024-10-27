// src/components/VerifyOtp.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { TextField, Button, Box, Alert, CircularProgress, Typography } from '@mui/material';

import { useNavigate } from 'react-router-dom';


const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const userEmail = useSelector((state) => state.auth.userEmail);
  const navigate = useNavigate();

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/user/forgetpassword/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, otp }),
      });

      if (!response.ok) {
        throw new Error('Invalid or expired OTP');
      }

      setAlert({ show: true, type: 'success', message: 'OTP verified successfully!' });
      navigate("/password-reset-questions-verfication")
    } catch (error) {
      setAlert({ show: true, type: 'error', message: 'Invalid or expired OTP. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: 'auto',
        marginTop: 5,
        padding: 4,
        borderRadius: 4,
        boxShadow: 3,
        backgroundColor: '#f9f9f9',
      }}
    >
      <Typography variant="h5" gutterBottom textAlign="center">
        Enter the OTP sent to your email
      </Typography>

      {alert.show && (
        <Alert severity={alert.type} sx={{ marginBottom: 2 }}>
          {alert.message}
        </Alert>
      )}

      <TextField
        fullWidth
        label="OTP"
        variant="outlined"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        sx={{ marginBottom: 3 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleVerifyOtp}
        disabled={loading || otp.length === 0}
        sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
      </Button>
    </Box>
  );
};

export default VerifyOtp;
