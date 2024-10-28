// src/components/VerifyOtp.js
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { TextField, Button, Box, Alert, CircularProgress, Stepper, Step, StepLabel, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RiVerifiedBadgeFill } from "react-icons/ri";

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [timeLeft, setTimeLeft] = useState(120); // countdown starts from 120 seconds
  const userEmail = useSelector((state) => state.auth.userEmail);
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setAlert({ show: true, type: 'error', message: 'OTP has expired. Please request a new one.' });
    }
  }, [timeLeft]);

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
      navigate("/password-reset-questions-verfication");
    } catch (error) {
      setAlert({ show: true, type: 'error', message: 'Invalid or expired OTP. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    'Find Your Account',
    'Verify the OTP',
    'Verify Answers',
    'Reset Password'
  ];

  // Handle OTP input to accept only 6-digit numbers
  const handleOtpChange = (e) => {
    const input = e.target.value;
    if (/^\d{0,6}$/.test(input)) {
      setOtp(input);
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
      <div>
        <Typography variant="h6" gutterBottom>
          Step 2: Verify the OTP
        </Typography>
        <Stepper activeStep={1} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
      <Typography variant="h5" marginTop={5} gutterBottom textAlign="center">
        Enter the OTP sent to your email
      </Typography>


      <Alert className='mb-3' severity="info"   textAlign="center" >OTP will expire in {timeLeft} seconds</Alert>




      <div className="mt-4">
          <label htmlFor="email" className="block font-bold text-sm text-black mb-1">Enter Otp</label>
          <input
            
             label="OTP"
            id="email"

            value={otp}
        onChange={handleOtpChange}
        disabled={timeLeft === 0}

         
           
            className="w-full px-4 py-2 border border-yellow-500 rounded-lg focus:border-yellow-500 focus:ring-yellow-500"
            placeholder="Enter OTP"
          />
        </div>

        <button
         type="button"
         onClick={handleVerifyOtp}
         disabled={loading || timeLeft === 0}




  className="w-full py-2 mb-4 bg-yellow-400 text-black rounded-lg mt-4 font-semibold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
>
{loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <div className="inline-block text-xl -mt-0.5 mr-2" />
        )}
        {loading ? 'Verifying...' : 'Continue'}
</button>





       
      


      




     
     

      {alert.show && (
        <Alert severity={alert.type} sx={{ marginBottom: 2 }}>
          {alert.message}
        </Alert>
      )}
    </Box>
  );
};

export default VerifyOtp;
