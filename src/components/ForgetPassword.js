import React, { useState } from 'react';
import { TextField, Button, Typography, Avatar, Box, Stepper, Step, StepLabel, Alert, AlertTitle, CircularProgress } from '@mui/material';
import { FaSearch } from "react-icons/fa";
import { RiMailSendFill } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import { setUserEmail } from '../Redux/authSlice';
import { useNavigate } from 'react-router-dom';
import useAxiosInstance from "../ContextAPI/AxiosInstance";



const FindAccount = () => {
  const navigate = useNavigate();
  const axiosInstance = useAxiosInstance();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [findloading, setFindLoading] = useState(false); // Loading state
  const [otploading, setOtpLoading] = useState(false); // Loading state

  const handleFindAccount = async () => {
    setFindLoading(true); // Set loading to true
    try {
      const response = await axiosInstance.post('/user/passowrd/forget-password', { email });
  
      setUser(response.data.user);
      setAlert({ show: true, type: 'success', message: 'Account found successfully!' });
    } catch (error) {
      setAlert({ show: true, type: 'error', message: 'User not found. Please try again.' });
      setUser(null);
    } finally {
      setFindLoading(false); // Set loading to false
    }
  };
  

  const steps = [
    'Find Your Account',
   
    'Verify Answers',
    'Reset Password'
  ];

  const handleVerifyAnswers = async () => {
    setOtpLoading(true); // Set loading to true
    try {
      const response = await axiosInstance.get(`/user/passowrd/get-questions/${email}`);
  
      // Handle response
      setOtpSent(true);
      setAlert({ show: true, type: "success", message: "Security questions retrieved successfully!" });
      dispatch(setUserEmail(email)); // Store email in Redux
  
      navigate("/password-reset-questions-verfication"); // Navigate to next step
    } catch (error) {
      setAlert({ show: true, type: "error", message: "Failed to fetch security questions. Please try again." });
    } finally {
      setOtpLoading(false); // Set loading to false
    }
  };
  


  return (
    <>
      <Box
        sx={{
          maxWidth: 500,
          margin: 'auto',
          marginTop: 15,
          padding: 4,
          borderRadius: 4,
          boxShadow: 3,
          backgroundColor: '#f9f9f9',
        }}
      >

<div>
    <Typography variant="h6" gutterBottom>
      Step 1: Find Your Account
    </Typography>
    <Stepper activeStep={0} alternativeLabel>
      {steps.map((label, index) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  </div>
        <Typography variant="h5" marginTop={5} gutterBottom textAlign="center">
          Let us help you find your account
        </Typography>

        {alert.show && (
          <Alert
            severity={alert.type}
            onClose={() => setAlert({ show: false, type: '', message: '' })}
            sx={{ marginBottom: 2 }}
          >
            <AlertTitle>{alert.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
            {alert.message}
          </Alert>
        )}

        <div className="mt-4">
        <label htmlFor="email" className="block text-gray-700 font-bold">Email</label>
<input
  type="email"
  id="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
  placeholder="Email"
  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
  required
/>

        </div>

        <button
  type="button"
  onClick={handleFindAccount}
  disabled={findloading}
  className="w-full py-2 bg-yellow-400 text-black rounded-lg mt-4 font-semibold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
>
  {findloading ? (
    <div className="flex items-center justify-center">
      <CircularProgress size={20} color="inherit" className="mr-2" />
      Finding...
    </div>
  ) : (
    'Continue'
  )}
</button>






        {/* Show Your Account header and account details if user is found */}
        {user && (
          <>
            <Typography
              variant="h6"
              textAlign="center"
              sx={{
                fontWeight: 'bold',
                marginTop: { xs: 2, md: 3 },
                color: '#555',
                fontSize: { xs: '1rem', md: '1.25rem' },
              }}
            >
              Your Account
            </Typography>
            
            <Box
              mt={{ xs: 2, md: 3 }}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                width: '100%',
                maxWidth: { xs: '100%', sm: 500, md: 600 },
                height: { xs: 100, md: 120 },
                margin: 'auto',
                padding: { xs: 1.5, md: 2 },
                borderRadius: 2,
                boxShadow: 2,
                backgroundColor: '#f1f1f1',
              }}
            >
              {/* Profile Image on the Left */}
              <Avatar
                src={user.profileImageUrl}
                alt={user.name}
                sx={{
                  width: { xs: 35, md: 40 },
                  height: { xs: 35, md: 40 },
                  marginRight: 2,
                  boxShadow: 1,
                }}
              />

              {/* User Name beside Profile Image */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  flexGrow: 3,
                  fontSize: { xs: '0.875rem', md: '1rem' },
                }}
              >
                {user.name}
              </Typography>

              {/* Send OTP button on the Right */}
              {!otpSent && (
                










<button
  type="button"
  onClick={handleVerifyAnswers}
  disabled={otploading}
  className="w-1/3 py-2 bg-yellow-400 text-black rounded-lg mt-4 font-semibold hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 flex items-center justify-center"
>
  {otploading ? (
    <div className="flex items-center space-x-2">
      
      <span>Sending...</span>
    </div>
  ) : (
    'Continue'
  )}
</button>


)}
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default FindAccount;
