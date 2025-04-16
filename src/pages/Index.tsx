
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  // Redirect to login page or dashboard based on authentication
  return <Navigate to="/login" replace />;
};

export default Index;
