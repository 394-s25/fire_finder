import { Box, Paper, Typography } from "@mui/material";
import banner from "../imgs/banner.png";

export default function FormContainer({ title, subtitle, children }) {
  return (
    <Box
      sx={{
        mt: 8,
        px: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <img
        src={banner}
        alt="FireFinder banner"
        style={{ maxWidth: 400, marginBottom: 16 }}
      />

      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 500,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        {title && (
          <Typography variant="h4" gutterBottom>
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
            {subtitle}
          </Typography>
        )}
        {children}
      </Paper>
    </Box>
  );
}
