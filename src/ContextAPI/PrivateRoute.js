import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../ContextAPI/AuthContext'; // Adjust the import path as necessary

const PrivateRoute = ({ element }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
