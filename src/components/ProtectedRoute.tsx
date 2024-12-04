import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/AuthStore";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;