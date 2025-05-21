import React from "react";
import {
  Box,
  CardContent,
  CardMedia,
  Avatar,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import banner from "../imgs/banner.png";

const ProfileCard = () => {
  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "#fff",
        mb: 2,
      }}
    >
      {/* Banner image */}
      <CardMedia
        component="img"
        image={banner}
        alt="Banner"
        sx={{
          height: 60,
          width: "100%",
        }}
      />

      {/* User info section */}
      <CardContent sx={{ pt: 0, pb: 2 }}>
        {/* Avatar */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: -4 }}>
          <Avatar
            alt="User Profile"
            src=""
            sx={{
              width: 72,
              height: 72,
              border: "3px solid #fff",
              backgroundColor: "#ccc",
            }}
          />
        </Box>

        {/* Username */}
        <Box sx={{ textAlign: "center", mt: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Times New Roman", Georgia, serif',
              fontWeight: "bold",
              fontSize: "1.1rem",
              textTransform: "uppercase",
            }}
          >
            USERNAME
          </Typography>

          {/* Bio */}
          <Typography
            variant="body2"
            sx={{
              fontFamily: '"Times New Roman", Georgia, serif',
              color: "gray",
              fontSize: "0.85rem",
              mt: 0.5,
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Typography>
        </Box>

        {/* Stats section - Optional */}
        <Divider sx={{ mt: 2, mb: 1.5 }} />
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontFamily: '"Times New Roman", Georgia, serif',
              fontSize: "0.75rem",
              color: "gray",
            }}
          >
            Profile views: 32
          </Typography>
        </Box>
      </CardContent>
    </Paper>
  );
};

export default ProfileCard;
