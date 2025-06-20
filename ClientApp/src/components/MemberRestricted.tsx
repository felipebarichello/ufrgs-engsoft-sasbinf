import { Navigate, useLocation } from "react-router-dom";

interface RestrictedProps {
  children: React.ReactNode;
}

function Restricted({ children }: RestrictedProps) {
  const location = useLocation();
  const tokenExpiration = sessionStorage.getItem("authTokenExpiration");
  const isTokenValid = tokenExpiration
    ? new Date(tokenExpiration) > new Date()
    : false;

  if (isTokenValid) {
    return <>{children}</>;
  } else {
    // FIXME: This smells. We should definitely redirect by role, not by path name.
    const isManagerRoute = location.pathname.includes("/manager");
    const redirectPath = isManagerRoute ? "/manager/login" : "/login";

    return <Navigate to={redirectPath} replace />;
  }
}

export default Restricted;
