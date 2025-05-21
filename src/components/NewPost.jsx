import React, { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Tooltip,
  Paper,
  Avatar,
  Fade,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PhotoIcon from "@mui/icons-material/Photo";
import EventIcon from "@mui/icons-material/Event";
import PollIcon from "@mui/icons-material/BarChart";
import PostModal from "./PostModal";
import EventModal from "./EventModal";
import PollModal from "./PollModal";

const NewPostModal = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const openPostModal = () => {
    setIsPostModalOpen(true);
    setIsExpanded(false);
  };

  const closePostModal = () => {
    setIsPostModalOpen(false);
  };

  const openEventModal = () => {
    setIsEventModalOpen(true);
    setIsExpanded(false);
  };

  const closeEventModal = () => {
    setIsEventModalOpen(false);
  };

  const openPollModal = () => {
    setIsPollModalOpen(true);
    setIsExpanded(false);
  };

  const closePollModal = () => {
    setIsPollModalOpen(false);
  };

  return (
    <>
      {/* LinkedIn style - Post creation button on mobile */}
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: "20px", sm: "30px" },
          right: { xs: "20px", sm: "30px" },
          display: { xs: "block", md: "none" },
          zIndex: 1100,
        }}
      >
        <Tooltip title="Create new post" placement="top">
          <IconButton
            onClick={toggleExpanded}
            sx={{
              backgroundColor: "rgb(171, 67, 67)",
              width: 56,
              height: 56,
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              "&:hover": {
                backgroundColor: "rgba(171, 67, 67, 0.9)",
              },
            }}
          >
            <AddIcon
              sx={{
                color: "white",
                fontSize: 28,
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>

      {/* LinkedIn style - Create post card for desktop */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: "100%",
          mb: 2,
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "#fff",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: "#ccc" }} />
            <Box
              onClick={toggleExpanded}
              sx={{
                flexGrow: 1,
                bgcolor: "#f5f5f5",
                borderRadius: 4,
                p: 1.2,
                pl: 2,
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "#e8e8e8",
                },
              }}
            >
              <Typography
                sx={{
                  color: "gray",
                  fontFamily: '"Times New Roman", Georgia, serif',
                }}
              >
                Start a post...
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Box
              onClick={openPostModal}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                p: 1,
                borderRadius: 1,
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              <PhotoIcon sx={{ color: "#4CAF50" }} />
              <Typography
                sx={{
                  fontFamily: '"Times New Roman", Georgia, serif',
                  color: "gray",
                  fontSize: "0.9rem",
                }}
              >
                Photo
              </Typography>
            </Box>

            <Box
              onClick={openEventModal}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                p: 1,
                borderRadius: 1,
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              <EventIcon sx={{ color: "#FF9800" }} />
              <Typography
                sx={{
                  fontFamily: '"Times New Roman", Georgia, serif',
                  color: "gray",
                  fontSize: "0.9rem",
                }}
              >
                Event
              </Typography>
            </Box>

            <Box
              onClick={openPollModal}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                p: 1,
                borderRadius: 1,
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              <PollIcon sx={{ color: "#F44336" }} />
              <Typography
                sx={{
                  fontFamily: '"Times New Roman", Georgia, serif',
                  color: "gray",
                  fontSize: "0.9rem",
                }}
              >
                Poll
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Mobile expanded menu */}
      <Fade in={isExpanded && window.innerWidth < 960}>
        <Box
          sx={{
            position: "fixed",
            bottom: { xs: "90px", sm: "100px" },
            right: { xs: "20px", sm: "30px" },
            display: { xs: "block", md: "none" },
            zIndex: 1099,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            p: 2,
            width: { xs: "200px", sm: "220px" },
          }}
        >
          <Box
            onClick={openPostModal}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1.5,
              cursor: "pointer",
              borderRadius: 1,
              "&:hover": { bgcolor: "#f5f5f5" },
              mb: 1,
            }}
          >
            <PhotoIcon sx={{ color: "#4CAF50", mr: 2 }} />
            <Typography
              sx={{
                fontFamily: '"Times New Roman", Georgia, serif',
              }}
            >
              Photo Post
            </Typography>
          </Box>

          <Box
            onClick={openEventModal}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1.5,
              cursor: "pointer",
              borderRadius: 1,
              "&:hover": { bgcolor: "#f5f5f5" },
              mb: 1,
            }}
          >
            <EventIcon sx={{ color: "#FF9800", mr: 2 }} />
            <Typography
              sx={{
                fontFamily: '"Times New Roman", Georgia, serif',
              }}
            >
              Create Event
            </Typography>
          </Box>

          <Box
            onClick={openPollModal}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1.5,
              cursor: "pointer",
              borderRadius: 1,
              "&:hover": { bgcolor: "#f5f5f5" },
            }}
          >
            <PollIcon sx={{ color: "#F44336", mr: 2 }} />
            <Typography
              sx={{
                fontFamily: '"Times New Roman", Georgia, serif',
              }}
            >
              Create Poll
            </Typography>
          </Box>
        </Box>
      </Fade>

      {/* Modals */}
      <PostModal open={isPostModalOpen} onClose={closePostModal} />
      <EventModal open={isEventModalOpen} onClose={closeEventModal} />
      <PollModal open={isPollModalOpen} onClose={closePollModal} />
    </>
  );
};

export default NewPostModal;
