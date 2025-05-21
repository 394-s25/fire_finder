import * as React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export default function PostsTabs({ value, setvalue }) {
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", justifyContent: "center", display: "flex" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        centered
        sx={{
          position: "fixed",
          top: { xs: "260px", sm: "100px", md: "100px" },
          minHeight: "36px",
          "& .MuiTabs-indicator": {
            backgroundColor: "#F97316",
          },
          "& .Mui-selected": {
            color: "#F97316 !important",
          },
          "& .MuiTab-root": {
            minHeight: "36px",
            padding: "6px 12px",
            fontFamily: '"Times New Roman", Georgia, serif',
            fontSize: { xs: "0.5rem", sm: ".8rem", md: ".8rem" },
            "&:focus": {
              outline: "none",
            },
            "&.Mui-focusVisible": {
              outline: "none",
            },
          },
        }}
      >
        <Tab label="Feed" />
        <Tab label="Saved" />
      </Tabs>
    </Box>
  );
}
