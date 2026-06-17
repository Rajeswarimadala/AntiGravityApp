import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context';

export const ProtectedRoute = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
