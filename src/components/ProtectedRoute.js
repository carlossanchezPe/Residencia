// src/components/ProtectedRoute.js
import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';
import React from 'react';


const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />; // Redirige a /login si no hay usuario autenticado
  }

  return children; // Renderiza la ruta protegida si el usuario está autenticado
};

export default ProtectedRoute;
