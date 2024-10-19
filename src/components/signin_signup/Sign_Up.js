import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../../Redux/userSlice'; // Import the action
import { Alert } from '@mui/material';
import  useAxiosInstance  from '../../ContextAPI/AxiosInstance'

function SignUpForm() {
  const navigate = useNavigate();


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [reEnterPasswordVisible, setReEnterPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState('Continue');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('error');
  const [nameError, setNameError] = useState(false);
  const axiosInstance = useAxiosInstance(); // Use your Axios instance

  
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setNameError(false);
    setAlertMessage(''); // Clear previous alert
  
    
    // Input validation
    if (!name) {
      setNameError(true);
      showAlert('Name is required');
      return;
    }
  
    if (!email || !password || !reEnterPassword) {
      showAlert('All fields are required');
      return;
    }
  
    if (!/\S+@\S+\.\S+/.test(email)) {
      showAlert('Invalid email format');
      return;
    }
  
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[!@#$%^&*]/.test(password)) {
      showAlert('Password must be at least 8 characters long, include a capital letter, and a special symbol');
      return;
    }
  
    if (password !== reEnterPassword) {
      showAlert('Passwords do not match');
      return;
    }
  
    setLoading(true);
    setButtonText('Sending OTP...');
  
    try {
      // Make the request using Axios instance
      const response = await axiosInstance.post('/api/auth/send-otp', {
        email,
      });
  
      // If successful, proceed with the next steps
      dispatch(setUserDetails({ name, email, password }));
      showAlert('OTP sent successfully!', 'success');
      navigate('/verify-otp');
    } catch (error) {
      console.error('Error sending OTP:', error); // Log error for debugging
      showAlert(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
      setButtonText('Continue');
    }
  };

  const fetchWithTimeout = (url, options, timeout = 8000) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Request timed out'));
      }, timeout);
  
      fetch(url, options)
        .then(response => {
          clearTimeout(timer);
          resolve(response);
        })
        .catch(err => {
          clearTimeout(timer);
          reject(err);
        });
    });
  };
  
  
  
  // Helper function to show alerts
  const showAlert = (message, severity = 'error') => {
    setAlertMessage(message);
    setAlertSeverity(severity); // You can define alert severity if needed
    setTimeout(() => setAlertMessage(''), 3000); // Clear after 3 seconds
  };
  

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (nameError && e.target.value) {
      setNameError(false); // Reset nameError when user starts typing
    }
  };

  return (
    <div className="flex flex-col gap-5 items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/path-to-your-logo.png" alt="Logo" className="mx-auto mb-4" />
        </div>
        {alertMessage && (
          <Alert severity={alertSeverity} className="mb-4">{alertMessage}</Alert>
        )}
        <form onSubmit={handleSubmit}>
          <div className={`mb-8`}>
            <label htmlFor="name" className="block text-gray-700 font-bold">Your Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange} // Use the new handleNameChange function
              className={`w-full p-2 border ${nameError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-yellow-500 focus:border-yellow-500`}
              placeholder="Your Name"
            />
          </div>
          <div className="mb-8">
            <label htmlFor="email" className="block text-gray-700 font-bold">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Email"
            />
          </div>
          <div className="mb-8 relative">
            <label htmlFor="password" className="block text-gray-700 font-bold">Password</label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute inset-y-0 right-2 flex items-center px-2 mt-6 text-gray-500"
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="mb-8 relative">
            <label htmlFor="reEnterPassword" className="block text-gray-700 font-bold">Re-enter Password</label>
            <input
              type={reEnterPasswordVisible ? 'text' : 'password'}
              id="reEnterPassword"
              value={reEnterPassword}
              onChange={(e) => setReEnterPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Re-enter Password"
            />
            <button
              type="button"
              onClick={() => setReEnterPasswordVisible(!reEnterPasswordVisible)}
              className="absolute inset-y-0 right-2 flex items-center px-2 mt-6 text-gray-500"
            >
              {reEnterPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            className={`w-full font-bold py-2 px-4 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={loading}
          >
            {buttonText}
          </button>
          <div className="my-4 border-t border-gray-300"></div>
          <div className="text-center">
            Already have an account?{' '}
            <NavLink to="/login" className="text-yellow-500 hover:underline">
              Log in
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;
