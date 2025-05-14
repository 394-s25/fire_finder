import {
  Button,
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";

export default function TradeCard({ data }) {
  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 1,
        backgroundColor: "white",
        border: "1px solid #ddd",
      }}
    >
      <Box sx={{ px: 2, pt: 1 }}>
        <Chip
          label={data.category || "Trade Category"}
          sx={{
            backgroundColor: "#B55050",
            color: "white",
            fontSize: "0.75rem",
          }}
          size="small"
        />
      </Box>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {data.name || "Trade Name"}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {data.description || "Brief description of what this trade involves."}
        </Typography>
      </CardContent>
      <Box display="flex" justifyContent="flex-end" px={2} pb={2}>
        <Button
          size="small"
          variant="contained"
          sx={{ backgroundColor: "#F26B3A" }}
        >
          Learn More
        </Button>
      </Box>
    </Card>
  );
}
