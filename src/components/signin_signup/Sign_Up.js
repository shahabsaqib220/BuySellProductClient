import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../../Redux/userSlice'; // Import the action
import { Alert } from '@mui/material';

function SignUpForm() {
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
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNameError(false);
    setAlertMessage(''); // Clear previous alert

    if (!name) {
      setNameError(true);
      setAlertMessage('Name is required');
      setTimeout(() => setAlertMessage(''), 3000); // Clear after 3 seconds
      return;
    }

    if (!email || !password || !reEnterPassword) {
      setAlertMessage('All fields are required');
      setTimeout(() => setAlertMessage(''), 3000);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setAlertMessage('Invalid email format');
      setTimeout(() => setAlertMessage(''), 3000);
      return;
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[!@#$%^&*]/.test(password)) {
      setAlertMessage('Password must be at least 8 characters long, include a capital letter, and a special symbol');
      setTimeout(() => setAlertMessage(''), 3000);
      return;
    }

    if (password !== reEnterPassword) {
      setAlertMessage('Passwords do not match');
      setTimeout(() => setAlertMessage(''), 3000);
      return;
    }

    setLoading(true);
    setButtonText('Sending OTP...');

    try {
      const response = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send OTP');
      }

      dispatch(setUserDetails({ name, email, password }));
      setAlertMessage('OTP sent successfully!');
      setAlertSeverity('success');
      setTimeout(() => setAlertMessage(''), 3000);

      navigate('/verify-otp');
    } catch (error) {
      setAlertMessage(error.message || 'Failed to send OTP');
      setTimeout(() => setAlertMessage(''), 3000);
    } finally {
      setLoading(false);
      setButtonText('Continue');
    }
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
