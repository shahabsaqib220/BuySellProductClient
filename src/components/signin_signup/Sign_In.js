import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Alert, Collapse } from '@mui/material'; // MUI components
import useAxiosInstance from '../../ContextAPI/AxiosInstance';
import { useAuth } from '../../ContextAPI/AuthContext'; // Import AuthContext

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // success or error
  const [showAlert, setShowAlert] = useState(false); // to show/hide the alert
  const [loading, setLoading] = useState(false); // Loading state for the login
  const axiosInstance = useAxiosInstance();
  const navigate = useNavigate();
  const [data, setData] = useState("")
  const { isLoggedIn, login } = useAuth(); // Use login function from AuthContext

  // Redirect to profile page if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/profile');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userData = { email, password };
  
    try {
      console.log('Logging in with:', userData); // Log user data being sent
      const response = await axiosInstance.post('/userlogin/login', userData);
  
      console.log('Login response:', response); // Log the full response
  
      if (response.status === 200) {
        const data = response.data;
  
        await login({ name: data.user.name, email: data.user.email, token: data.token });
  
        setAlertMessage('Login successful!');
        setAlertType('success');
        setShowAlert(true);
  
        setTimeout(() => {
          navigate('/profile');
        }, 1000);
      } else {
        setAlertMessage(data.message || 'Invalid credentials. Please try again.');
        setAlertType('error');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Login error:', error); // Log the error for debugging
      if (error.response && error.response.data) {
        setAlertMessage(error.response.data.message || 'Something went wrong. Please try again later.');
      } else {
        setAlertMessage('Something went wrong. Please try again later.');
      }
      setAlertType('error');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="mb-8">
        <img src="/path/to/logo.png" alt="Logo" className="w-32 h-auto" />
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        <Collapse in={showAlert} className="mb-4" style={{ minHeight: showAlert ? '48px' : '0px' }}>
          {showAlert && (
            <Alert severity={alertType} onClose={() => setShowAlert(false)}>
              {alertMessage}
            </Alert>
          )}
        </Collapse>

        <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label htmlFor="email" className="block font-bold text-sm text-black mb-1">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email or mobile phone number"
              className="w-full px-4 py-2 border border-yellow-500 rounded-lg focus:border-yellow-500 focus:ring-yellow-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-bold text-black mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-yellow-500 rounded-lg focus:border-yellow-500 focus:ring-yellow-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading} // Disable the button while loading
            className="w-full py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            {loading ? 'Loading...' : 'Continue'} {/* Change button text based on loading state */}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">New Here?</p>
          <NavLink
            to="/register"
            className="inline-block mt-2 px-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-400"
          >
            Create your Account
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
