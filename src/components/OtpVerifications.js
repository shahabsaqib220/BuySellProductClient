import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import axios from 'axios';
import { Alert, Step, StepLabel, Stepper } from '@mui/material';
import { toast } from 'react-toastify';
import useAxiosInstance from '../ContextAPI/AxiosInstance';

function VerifyOtp() {

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const [timerExpired, setTimerExpired] = useState(false);
  const axiosInstance = useAxiosInstance(); // Use your Axios instance

  const navigate = useNavigate();
  const { email } = useSelector((state) => state.userreg);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setTimerExpired(true);
    }
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    
    // Basic validation to check OTP length
    if (otp.length !== 6) {
      toast.error('OTP must be 6 digits');
      return;
    }
  
    setLoading(true);
    try {
      // Call API to verify OTP using the custom Axios instance
      const response = await axiosInstance.post('/auth/verify-otp', { email, otp });
      
      // If OTP is verified successfully
      toast.success('OTP verified successfully!');
      navigate('/security-questions');
    } catch (error) {
      // Handle errors related to OTP
      const errorResponse = error.response?.data || {};
      const errorMessage = errorResponse.message || 'Invalid OTP';
      toast.error(errorMessage);
  
      // Specific cases for expired or invalid OTPs
      if (errorResponse.code === 'OTP_EXPIRED') {
        toast.error('OTP has expired. Please request a new one.');
      } else if (errorResponse.code === 'INVALID_OTP') {
        toast.error('Incorrect OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    'Basic Information',
    'Verify the OTP',
    'Setup Security Question',
    
  ];

  return (
    <div className="flex flex-col gap-5 items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <Stepper activeStep={1} alternativeLabel>
      {steps.map((label, index) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
        <h2 className="text-center text-2xl font-bold">Enter OTP</h2>
        <div className="mb-4">
          {timerExpired ? (
            <Alert severity="error">OTP has expired. Please request a new one.</Alert>
          ) : (
            <Alert severity="info">OTP expires in {countdown} seconds</Alert>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label htmlFor="otp" className="block text-gray-700 font-bold">OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              disabled={timerExpired} // Disable input if timer expired
            />
          </div>
          <button
            type="submit"
            className={`w-full font-bold py-2 px-4 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 ${loading || timerExpired ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={loading || timerExpired} // Disable button if loading or timer expired
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtp;
