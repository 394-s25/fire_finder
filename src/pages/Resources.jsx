import React, { useState } from "react";
import Navbar from "../components/NavBar";
import { Box, Tabs, Tab, Typography, Grid } from "@mui/material";
import ClassCard from "../components/ClassCard";
import TrainingCard from "../components/TrainingCard";
import TradeCard from "../components/TradeCard";
import ContactCard from "../components/ContactCard";
import ResourcesTab from "../components/ResourcesTab";

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Resources = () => {
  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const mockClasses = [
    {
      id: 1,
      trade: "Electrician",
      instructor: "Mr. Watts",
      location: "123 random ave, Evanston, IL, 60201",
      start: "05/08/2025",
      end: "06/27/2025",
    },
    {
      id: 2,
      trade: "Electrician",
      instructor: "Mr. Watts",
      location: "123 random ave, Evanston, IL, 60201",
      start: "05/08/2025",
      end: "06/27/2025",
    },
    {
      id: 3,
      trade: "Electrician",
      instructor: "Mr. Watts",
      location: "123 random ave, Evanston, IL, 60201",
      start: "05/08/2025",
      end: "06/27/2025",
    },
  ];

  const mockTrainings = [
    {
      id: 1,
      topic: "Resume Building",
      title: "How to Write a Great Resume",
      instructor: "Career Center",
      duration: "2 hours",
      description:
        "Learn the essentials of resume formatting and content creation.",
    },
    {
      id: 2,
      topic: "Interview Skills",
      title: "Nailing the Interview",
      instructor: "Job Prep Center",
      duration: "1.5 hours",
      description:
        "Practice common questions and responses to boost confidence.",
    },
  ];

  const mockTrades = [
    {
      id: 1,
      name: "Electrician",
      category: "Construction",
      description:
        "Install and maintain electrical systems in homes and buildings.",
    },
    {
      id: 2,
      name: "Welder",
      category: "Manufacturing",
      description:
        "Use heat to fuse metal parts together for construction and repair.",
    },
  ];

  const mockContacts = [
    {
      id: 1,
      name: "Jane Smith",
      role: "Career Counselor",
      email: "jane.smith@careers.org",
      phone: "555-123-4567",
      image: "",
    },
    {
      id: 2,
      name: "John Doe",
      role: "Trade School Advisor",
      email: "john.doe@tradeschool.edu",
      phone: "555-987-6543",
      image: "",
    },
  ];

  return (
    <>
      <Navbar />
      <Box sx={{ pt: "112px", px: 2 }}>
        <Box
          sx={{
            position: "absolute",
            top: "64px",
            left: 0,
            right: 0,
            zIndex: 1000,
          }}
        >
          <Tabs
            value={tab}
            onChange={handleChange}
            centered
            sx={{
              mt: 2,
              mb: 3,
              borderBottom: 1,
              borderColor: "#444",
              "& .MuiTab-root": {
                color: "#aaa",
                textTransform: "uppercase",
                fontWeight: "bold",
                "&Mui-selected": {
                  color: "#F26B3A",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#F26B3A",
              },
            }}
          >
            <Tab label="Classes" />
            <Tab label="Training" />
            <Tab label="Trades" />
            <Tab label="Contacts" />
          </Tabs>
        </Box>

        <Box sx={{ px: 2, pb: 5 }}>
          <TabPanel value={tab} index={0}>
            <ResourcesTab
              title="Explore Classes"
              data={mockClasses}
              CardComponent={ClassCard}
            />
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <ResourcesTab
              title="Training Resources"
              data={mockTrainings}
              CardComponent={TrainingCard}
            />
          </TabPanel>

          <TabPanel value={tab} index={2}>
            <ResourcesTab
              title="Trade Information"
              data={mockTrades}
              CardComponent={TradeCard}
            />
          </TabPanel>

          <TabPanel value={tab} index={3}>
            <ResourcesTab
              title="Contacts"
              data={mockContacts}
              CardComponent={ContactCard}
            />
          </TabPanel>
        </Box>
      </Box>
    </>
  );
};

export default Resources;
