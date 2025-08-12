import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { Spinner, Flex } from "@chakra-ui/react";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const location = useLocation();

  if (isLoading) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!isAuthenticated) {
    loginWithRedirect({
      appState: { returnTo: location.pathname + location.search },
    });
    return null;
  }

  return children;
}
