import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Alert, Collapse } from '@mui/material'; // MUI components
import { useAuth } from '../../ContextAPI/AuthContext'; // Import AuthContext

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // success or error
  const [showAlert, setShowAlert] = useState(false); // to show/hide the alert

  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth(); // Use login function from AuthContext

  // Redirect to profile page if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/profile');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { email, password };

    try {
      const response = await fetch('http://localhost:5000/api/userlogin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success alert
        setAlertMessage('Login successful!');
        setAlertType('success');
        setShowAlert(true);

        // Clear alert after 3 seconds
        setTimeout(() => setShowAlert(false), 3000);

        // Use the login method from AuthContext
        login({ name: data.user.name, email: data.user.email, token: data.token });

        // Redirect to the profile page immediately after login
        navigate('/profile');
      } else {
        // Show error alert for invalid credentials
        setAlertMessage(data.message || 'Invalid credentials. Please try again.');
        setAlertType('error');
        setShowAlert(true);

        // Clear alert after 3 seconds
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      // Handle any unexpected errors
      setAlertMessage('Something went wrong. Please try again later.');
      setAlertType('error');
      setShowAlert(true);

      // Clear alert after 3 seconds
      setTimeout(() => setShowAlert(false), 3000);
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
            className="w-full py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            Continue
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
