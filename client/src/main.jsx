import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
//import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain="dev-ea27dazhpocuo306.us.auth0.com"
        clientId="vXLBA8aqnYmLBYWO0fns43VRmGrko3Im"
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: "https://dev-ea27dazhpocuo306.us.auth0.com/api/v2/",
        }}
        cacheLocation="localstorage"
      >
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);
