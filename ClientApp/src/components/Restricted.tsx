import React from "react";
import { Navigate } from "react-router-dom";

interface RestrictedProps {
  children: React.ReactNode;
}

function Restricted({ children }: RestrictedProps) {
  const isLoggedIn = Boolean(sessionStorage.getItem("authToken"));

  if (isLoggedIn) {
    // If logged in, render the children components
    return <>{children}</>;
  } else {
    // If not logged in, redirect to the login page
    return <Navigate to="/login" replace />;
  }
}

export default Restricted;