import { Box, Typography, Paper } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export default function TotalStudentsCard({
  total = 2354,
  percentChange = null,
}) {
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
          Total Students
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {total.toLocaleString()}
        </Typography>
        {percentChange !== undefined && (
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <TrendingUpIcon sx={{ color: "#00C292", fontSize: 20, mr: 0.5 }} />
            <Typography sx={{ color: "#00C292", fontWeight: 500, mr: 0.5 }}>
              {percentChange}%
            </Typography>
            <Typography sx={{ color: "#666666" }}>Up from yesterday</Typography>
          </Box>
        )}
      </Box>

      {/* Right section - icon */}
      <Box
        sx={{
          backgroundColor: "#EAE6FD",
          p: 1.5,
          borderRadius: "14px",
        }}
      >
        <PeopleAltIcon sx={{ fontSize: 40, color: "#7B61FF" }} />
      </Box>
    </Paper>
  );
}
