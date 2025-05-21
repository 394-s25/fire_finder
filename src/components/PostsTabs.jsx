import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";

const PostsTabs = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "50%",
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="standard"
        TabIndicatorProps={{
          style: {
            backgroundColor: "#F97316",
            height: 2,
          },
        }}
        sx={{
          "& .Mui-selected": {
            color: "#F97316 !important",
            fontWeight: "bold",
          },
          "& .MuiTab-root": {
            textTransform: "none",
            fontFamily: '"Times New Roman", Georgia, serif',
            fontSize: "0.9rem",
            padding: "12px 16px",
            minWidth: "70px",
          },
        }}
      >
        <Tab label="Feed" />
        <Tab label="Saved" />
      </Tabs>
    </Box>
  );
};

export default PostsTabs;
