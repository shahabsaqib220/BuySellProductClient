import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../ContextAPI/AuthContext';

const PrivateRoute = ({ element }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
