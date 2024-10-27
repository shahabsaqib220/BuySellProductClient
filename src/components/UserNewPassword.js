import React, { useState } from 'react';
import { TextField, Button, Alert, Box, Typography } from '@mui/material';
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

  return (
    <Box display="flex" flexDirection="column" alignItems="center" maxWidth={400} margin="auto" padding={3}>
      <Typography variant="h5" mb={3}>Update Password</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TextField
        label="New Password"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Confirm New Password"
        type="password"
        fullWidth
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" color="primary" onClick={handleUpdatePassword}>
        Update Password
      </Button>
    </Box>
  );
};

export default PasswordUpdateComponent;
