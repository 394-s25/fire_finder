import { createTheme } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "0.6em 1.2em",
        },
      },
    },
  },
  palette: {
    mode: "light",
    primary: { main: "#DC2626" },
    secondary: { main: "#F26B3A" },
    warning: { main: "#FACC15" },
    background: { default: "#f5f5f5" },
    text: { primary: "#213547" },
  },
});

export default theme;
