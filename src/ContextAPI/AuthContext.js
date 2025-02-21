import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap around components that need access to auth state
export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser ] = useState(null);
  const [token, setToken] = useState(null);

  // Fetch token and user data from localStorage if they exist
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser  = localStorage.getItem('user');

    if (storedToken) {
      // Validate the token here (optional, but recommended)
      const isValid = validateToken(storedToken); // Implement this function
      if (isValid) {
        setToken(storedToken);
        setIsLoggedIn(true);
        if (storedUser ) {
          setUser (JSON.parse(storedUser ));
        }
      } else {
        // If the token is invalid, clear the local storage
        logout();
      }
    }
  }, []);

  const login = (userData) => {
    try {
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoggedIn(true);
      setUser (userData);  // Ensure profileImageUrl is part of userData
      setToken(userData.token);
    } catch (error) {
      console.error('Failed to log in:', error);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser (null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Function to validate the token (you can implement your own logic)
  const validateToken = (token) => {
    // Decode the token and check its expiration
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload
    const isExpired = Date.now() >= payload.exp * 1000; // Check if the token is expired
    return !isExpired; // Return true if the token is valid
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}