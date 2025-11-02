import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role !== 'admin') {
          sessionStorage.setItem('noAccessMessage', 'Access denied: Admins only');
        }
      } catch {
        sessionStorage.setItem('noAccessMessage', 'Invalid token. Please login again.');
      }
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.role !== 'admin') {
      return <Navigate to="/" />;
    }
  } catch {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
