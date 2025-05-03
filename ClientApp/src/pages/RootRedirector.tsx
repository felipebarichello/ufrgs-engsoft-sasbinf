import { Navigate } from "react-router-dom";

function RootRedirector() {
  // Check if the token exists in sessionStorage
  // Using !! converts the result (string or null) to a boolean
  const isLoggedIn = !!sessionStorage.getItem("authToken");

  console.log("RootRedirector: isLoggedIn =", isLoggedIn); // For debugging

  // Conditionally render the Navigate component
  if (isLoggedIn) {
    // If logged in, redirect to the main content page
    return <Navigate to="/rooms" replace />;
  } else {
    // If not logged in, redirect to the login page
    return <Navigate to="/login" replace />;
  }
}

export default RootRedirector;
