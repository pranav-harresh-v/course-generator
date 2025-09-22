import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const location = useLocation();

  if (!isAuthenticated) {
    loginWithRedirect({
      appState: { returnTo: location.pathname + location.search },
    });
    return null;
  }

  return children;
}
