import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

import { useDispatch } from 'react-redux';
import { setUserDetails } from '../../Redux/userSlice'; // Import the action
import { Alert,  Stepper, Step, StepLabel, } from '@mui/material';
import  useAxiosInstance  from '../../ContextAPI/AxiosInstance'

function SignUpForm() {
  const navigate = useNavigate();
  const { t } = useTranslation()


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
      showAlert(t('nameRequired'));
      return;
    }
  
    if (!email || !password || !reEnterPassword) {
      showAlert(t('allFieldsRequired'));
      return;
    }
  
    if (!/\S+@\S+\.\S+/.test(email)) {
      showAlert(t('invalidEmail'));
      return;
    }
  
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[!@#$%^&*]/.test(password)) {
      showAlert(t('passwordRequirements'));
      return;
    }
  
    if (password !== reEnterPassword) {
      showAlert(t('passwordsNotMatch'));
      return;
    }
  
    setLoading(true);
    setButtonText(t('sendingOtp')); // Translate "Sending OTP..."
  
    try {
      // Make the request using Axios instance
      const response = await axiosInstance.post('/auth/send-otp', { email });
  
      // If successful, proceed with the next steps
      dispatch(setUserDetails({ name, email, password }));
      showAlert(t('otpSent'), 'success'); // Translate "OTP sent successfully!"
      navigate('/verify-otp');
    } catch (error) {
      console.error('Error sending OTP:', error); // Log error for debugging
      showAlert(error.response?.data?.message || t('otpError'));
    } finally {
      setLoading(false);
      setButtonText(t('continue')); // Translate "Continue"
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

  const steps = [
    t("basicInformation"),
    t("verifyOTP"),
    t("setupSecurityQuestion"),
  ];

  return (
    <div className="flex flex-col gap-5 items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <Stepper activeStep={0} alternativeLabel>
      {steps.map((label, index) => (
        <Step key={index}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
        <div className="text-center mb-6">
          <img src="/path-to-your-logo.png" alt="Logo" className="mx-auto mb-4" />
        </div>
        <h2 className="text-center text-2xl font-bold">{t("createAccount")}</h2>

        {alertMessage && (
          <Alert severity={alertSeverity} className="mb-4">{alertMessage}</Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className={`mb-8`}>
            <label htmlFor="name" className="block text-gray-700 font-bold"> {t("yourName")}</label>
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
            <label htmlFor="email" className="block text-gray-700 font-bold">{t("email")}</label>
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
            <label htmlFor="password" className="block text-gray-700 font-bold"> {t("password")}</label>
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
            <label htmlFor="reEnterPassword" className="block text-gray-700 font-bold"> {t("reEnterPassword")}</label>
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
                    {loading ? t("loading") : t("continue")}

          </button>
          <div className="my-4 border-t border-gray-300"></div>
          <div className="text-center">
          {t("alreadyHaveAccount")}
            <NavLink to="/login" className="text-yellow-500 hover:underline">
            {t("login")}
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;
