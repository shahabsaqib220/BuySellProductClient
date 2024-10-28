import React, { useState } from 'react';
import { TextField, Button, Alert, Box, Typography, Stepper, Step, StepLabel, } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from '../Redux/authSlice'; // Import your Redux action
import axios from 'axios';



const PasswordUpdateComponent = () => {
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.auth.userEmail); // Fetch user email from Redux state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading,setLoading] = useState(false);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleUpdatePassword = async () => {
    setError('');
    setSuccess('');

    if (!validatePassword(password)) {
      return setError(
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      );
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }


  

    try {
        const response = await fetch('http://localhost:5000/api/user/forgetpassword/update-password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: userEmail, newPassword: password }),
        });
    
        if (response.ok) {
          setSuccess('Password updated successfully!');
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to update password. Please try again.');
        }
      } catch (error) {
        console.error('Error updating password:', error);
        setError('Failed to update password. Please try again.');
      }
    }

    const steps = [
        'Find Your Account',
        'Verify the OTP',
        'Verify Answers',
        'Reset Password'
      ];

  return (
    <Box display="flex" flexDirection="column" alignItems="center" maxWidth={400} margin="auto" padding={3}>

<div>
    <Typography variant="h6" gutterBottom>
      Step 4: Reset Password
    </Typography>
    <Stepper activeStep={3} alternativeLabel>
      {steps.map((label, index) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  </div>
 
      <Typography variant="h5" mb={3} mt={3}>Update Password</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <div className="mb-8 w-full">
  <label htmlFor="password" className="block font-bold text-sm text-black mb-2">
    New Password
  </label>
  <input
    label="New Password"
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Enter New Password"
    className="w-full px-4 py-2 border border-yellow-500 rounded-lg focus:border-yellow-500 focus:ring-yellow-500"
    required
  />
</div>

<div className="mb-8 w-full">
  <label htmlFor="confirmPassword" className="block font-bold text-sm text-black mb-2">
    Confirm New Password
  </label>
  <input
    label="Confirm New Password"
    type="password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    placeholder="Enter Confirm New Password"
    className="w-full px-4 py-2 border border-yellow-500 rounded-lg focus:border-yellow-500 focus:ring-yellow-500"
    required
  />
</div>


<button
onClick={handleUpdatePassword}
            type="submit"
            disabled={loading} // Disable the button while loading
            className="w-full py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            {loading ? 'Updating...' : 'Update Password'} {/* Change button text based on loading state */}
          </button>






    

    

      
    </Box>
  );
};

export default PasswordUpdateComponent;
