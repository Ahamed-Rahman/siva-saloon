import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    alert('Please login to access this page.');
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
