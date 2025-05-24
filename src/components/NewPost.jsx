import React, { useState } from "react";
import { Box, IconButton, Typography, Tooltip } from "@mui/material";
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
  };

  const closePostModal = () => {
    setIsPostModalOpen(false);
  };

  const openEventModal = () => {
    setIsEventModalOpen(true);
  };

  const closeEventModal = () => {
    setIsEventModalOpen(false);
  };

  const openPollModal = () => {
    setIsPollModalOpen(true);
  };

  const closePollModal = () => {
    setIsPollModalOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Circular "+" Button with Tooltip */}
      <Tooltip title="New Post" placement="top">
        <IconButton
          onClick={toggleExpanded}
          sx={{
            backgroundColor: "rgb(255, 239, 239)", // Match your color scheme
            width: { xs: "40px", sm: "48px", md: "48px" },
            height: { xs: "40px", sm: "48px", md: "48px" },
            "&:hover": {
              backgroundColor: "rgba(171, 67, 67, 0.8)", // Slightly darker on hover
            },
          }}
        >
          <AddIcon
            sx={{
              borderStyle: "solid",
              borderRadius: "50%",
              borderColor: "rgb(171, 67, 67)",
              color: "rgb(171, 67, 67)",
              fontSize: { xs: "24px", sm: "28px", md: "40px" },
            }}
          />
        </IconButton>
      </Tooltip>

      {/* Sideways Dropdown */}
      {isExpanded && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginLeft: "8px",
            width: { xs: "calc(90% - 48px)", sm: "277px", md: "277px" }, // Match ProfileCard width minus button width
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginRight: "16px",
            }}
          >
            <IconButton onClick={openPostModal}>
              <PhotoIcon
                sx={{
                  color: "#4CAF50",
                  fontSize: { xs: "20px", sm: "24px", md: "24px" },
                }}
              />
            </IconButton>
            <Typography
              variant="caption"
              sx={{
                marginTop: "-10px",
                fontFamily: '"Times New Roman", Georgia, serif',
                color: "#4CAF50",
                fontSize: { xs: "8px", sm: "10px", md: "10px" },
              }}
            >
              Post
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginRight: "16px",
            }}
          >
            <IconButton onClick={openEventModal}>
              <EventIcon
                sx={{
                  color: "#FF9800",
                  fontSize: { xs: "20px", sm: "24px", md: "24px" },
                }}
              />
            </IconButton>
            <Typography
              variant="caption"
              sx={{
                marginTop: "-10px",
                fontFamily: '"Times New Roman", Georgia, serif',
                color: "#FF9800",
                fontSize: { xs: "8px", sm: "10px", md: "10px" },
              }}
            >
              Event
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <IconButton onClick={openPollModal}>
              <PollIcon
                sx={{
                  color: "#F44336",
                  fontSize: { xs: "20px", sm: "24px", md: "24px" },
                }}
              />
            </IconButton>
            <Typography
              variant="caption"
              sx={{
                marginTop: "-10px",
                fontFamily: '"Times New Roman", Georgia, serif',
                color: "#F44336",
                fontSize: { xs: "8px", sm: "10px", md: "10px" },
              }}
            >
              Poll
            </Typography>
          </Box>
        </Box>
      )}
      <PostModal open={isPostModalOpen} onClose={closePostModal} />
      <EventModal open={isEventModalOpen} onClose={closeEventModal} />
      <PollModal open={isPollModalOpen} onClose={closePollModal} />
    </Box>
  );
};

export default NewPostModal;
