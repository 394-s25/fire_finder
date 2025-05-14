import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./services/userProvider.jsx";
import { ThemeProvider } from "@mui/material";
import theme from "./theme.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </UserProvider>
  </StrictMode>
);
