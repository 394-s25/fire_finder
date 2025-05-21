import React from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import Navbar from "../components/NavBar";
import ProfileCard from "../components/ProfileCard";
import NewPostModal from "../components/NewPost";
import PostsTabs from "../components/PostsTabs";
import SortDropdown from "../components/SortDropdown";
import PostCard from "../components/PostCard";
import SearchBar from "../components/HomeSearch";

const Home = () => {
  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Fixed Navbar at top */}
      <Navbar />

      {/* Main content with three columns */}
      <Container
        maxWidth="lg"
        sx={{
          pt: "80px", // Space for navbar
          pb: 4,
        }}
      >
        <Grid container spacing={2}>
          {/* Left column - Profile Info */}
          <Grid item xs={12} md={3}>
            <Box sx={{ position: "sticky", top: "90px" }}>
              <ProfileCard />
            </Box>
          </Grid>

          {/* Center column - Feed */}
          <Grid item xs={12} md={6}>
            {/* Tabs and sort controls */}
            <Paper
              elevation={1}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "#fff",
              }}
            >
              <PostsTabs />
              <SortDropdown />
            </Paper>

            {/* Posts feed */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <PostCard />
              <PostCard />
              {/* Add more PostCard components */}
            </Box>
          </Grid>

          {/* Right column - Search and suggestions */}
          <Grid item xs={12} md={3}>
            <Box sx={{ position: "sticky", top: "90px" }}>
              {/* Search bar */}
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  mb: 2,
                  borderRadius: 2,
                  bgcolor: "#fff",
                }}
              >
                <SearchBar />
              </Paper>

              {/* Suggestions */}
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "#fff",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1.5,
                    fontFamily: '"Times New Roman", Georgia, serif',
                    fontSize: "1rem",
                    fontWeight: "bold",
                  }}
                >
                  Suggested For You
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: '"Times New Roman", Georgia, serif',
                    fontSize: "0.9rem",
                    color: "gray",
                  }}
                >
                  Suggested content will appear here.
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Fixed action button */}
      <NewPostModal />
    </Box>
  );
};

export default Home;
