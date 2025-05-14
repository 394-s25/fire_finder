import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../imgs/logo.png'; // Adjust the path to your logo image
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import LocalActivityOutlinedIcon from '@mui/icons-material/LocalActivityOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useNavigate, useLocation } from 'react-router-dom';
import Flogo from "../imgs/Flogo.png"; 

const Navbar = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const location = useLocation();
  const navigate = useNavigate();
  const routeTitles = {
    '/': 'Explore',
    '/profile': 'Profile',
    '/resources': 'Resources',
    '/events': 'Events',
  };
  const handleNavigation = (path) => {
    navigate(path);
    togglePanel(); // Close the panel after navigation
  };
  const currentTitle = routeTitles[location.pathname];

  return (
    // left(logo), mid(page title), right(menu)
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "rgb(255, 251, 251)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          zIndex: 1100,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-middle",
            }}
          >
            {/* <Typography
              variant="h8"
              sx={{
                color: '#DC2626',
                fontWeight: 'bold',
                fontFamily: '"Times New Roman", Georgia, serif',
                marginTop: 1,
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
              }}
            >
              FireFinder
            </Typography> */}
            <Box
              component="img"
              src={Flogo}
              alt="TC logo"
              sx={{
                width: { xs: "40px", sm: "50px", md: "120px" },
                height: { xs: "52px", sm: "65px", md: "80px" },
                marginLeft: { xs: "5px", sm: "10px", md: "-20px" },
                marginTop: { xs: "2px", sm: "3px", md: "3px" },
                marginBottom: { xs: "2px", sm: "3px", md: "3px" },
              }}
            />
          </div>
          <Typography
            variant="h2"
            sx={{
              color: "#DC2626",
              fontFamily: '"Times New Roman", Georgia, serif',
              marginBottom: 1,
              marginTop: 1,
              fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
            }}
          >
            {currentTitle}
          </Typography>
          <IconButton
            edge="end"
            aria-label="menu"
            onClick={togglePanel}
            sx={{ marginRight: { xs: 0.5, sm: 1, md: 1 } }}
          >
            <MenuIcon
              sx={{
                color: "#DC2626",
                alignItems: "middle",
                fontSize: { xs: "20px", sm: "24px", md: "24px" },
              }}
            />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={isPanelOpen}
        onClose={togglePanel}
        sx={{
          zIndex: 1500,
          "& .MuiDrawer-paper": {
            width: { xs: "80px", sm: "100px", md: "100px" },
            backgroundColor: "white",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            marginTop: "100px",
            borderRadius: "10px",
          },
        }}
      >
        <List sx={{ width: "100%" }}>
          <ListItem
            button
            onClick={() => handleNavigation("/profile")}
            sx={{
              flexDirection: "column",
              alignItems: "center",
              backgroundColor:
                location.pathname === "/profile" ? "#FEE2E2" : "transparent",
            }}
          >
            <>
              <AccountCircleIcon
                sx={{
                  color: "#DC2626",
                  fontSize: { xs: "20px", sm: "24px", md: "24px" },
                }}
              />
              <ListItemText
                primary="Profile"
                sx={{
                  color: "#DC2626",
                  fontSize: { xs: "8px", sm: "10px", md: "10px" },
                }}
              />
            </>
          </ListItem>
          <ListItem
            button
            onClick={() => handleNavigation("/resources")}
            sx={{
              flexDirection: "column",
              alignItems: "center",
              backgroundColor:
                location.pathname === "/resources" ? "#FEE2E2" : "transparent",
            }}
          >
            <>
              <GroupsOutlinedIcon
                sx={{
                  color: "#DC2626",
                  fontSize: { xs: "20px", sm: "24px", md: "24px" },
                }}
              />
              <ListItemText
                primary="Resources"
                sx={{
                  color: "#DC2626",
                  fontSize: { xs: "8px", sm: "10px", md: "10px" },
                }}
              />
            </>
          </ListItem>
          <ListItem
            button
            onClick={() => handleNavigation("/events")}
            sx={{
              flexDirection: "column",
              alignItems: "center",
              backgroundColor:
                location.pathname === "/events" ? "#FEE2E2" : "transparent",
            }}
          >
            <>
              <LocalActivityOutlinedIcon
                sx={{
                  color: "#DC2626",
                  fontSize: { xs: "20px", sm: "24px", md: "24px" },
                }}
              />
              <ListItemText
                primary="Events"
                sx={{
                  color: "#DC2626",
                  fontSize: { xs: "8px", sm: "10px", md: "10px" },
                }}
              />
            </>
          </ListItem>
          <ListItem
            button
            onClick={() => handleNavigation("/")}
            sx={{
              flexDirection: "column",
              alignItems: "center",
              backgroundColor:
                location.pathname === "/" ? "#FEE2E2" : "transparent",
            }}
          >
            <>
              <HomeOutlinedIcon
                sx={{
                  color: "#DC2626",
                  fontSize: { xs: "20px", sm: "24px", md: "24px" },
                }}
              />
              <ListItemText
                primary="Explore"
                sx={{
                  color: "#DC2626",
                  fontSize: { xs: "8px", sm: "10px", md: "10px" },
                }}
              />
            </>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;