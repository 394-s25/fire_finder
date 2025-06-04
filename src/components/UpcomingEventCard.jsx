import { Box, Typography, Paper } from "@mui/material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import InsertChartIcon from "@mui/icons-material/InsertChart";

export default function UpcomingEventCard({
  name = "Tech Trade Expo",
  rsvps = 45,
  percentChange = -55,
}) {
  const isNegative = percentChange < 0;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "20px",
        px: 3,
        py: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #F0F0F0",
      }}
    >
      {/* Left section */}
      <Box>
        <Typography sx={{ color: "#666666", fontWeight: 500 }}>
          Upcoming Event RSVPs
        </Typography>
        <Typography sx={{ fontWeight: 500, color: "#666666", fontSize: 14 }}>
          {name}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {rsvps}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <TrendingDownIcon sx={{ color: "#F44336", fontSize: 20, mr: 0.5 }} />
          <Typography sx={{ color: "#F44336", fontWeight: 500, mr: 0.5 }}>
            {Math.abs(percentChange)}%
          </Typography>
          <Typography sx={{ color: "#666666" }}>
            Down from previous event
          </Typography>
        </Box>
      </Box>

      {/* Right section */}
      <Box
        sx={{
          backgroundColor: "#E3F8ED",
          p: 1.5,
          borderRadius: "14px",
        }}
      >
        <InsertChartIcon sx={{ fontSize: 40, color: "#47C49E" }} />
      </Box>
    </Paper>
  );
}
