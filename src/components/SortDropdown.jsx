import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  InputBase,
  styled,
} from "@mui/material";

const MinimalInput = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    fontSize: 14,
    padding: "5px 26px 5px 12px",
    color: "inherit",
    width: "100px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    "&:focus": {
      backgroundColor: "transparent",
    },
  },
  "& .MuiSelect-icon": {
    color: "inherit",
  },
}));

const SortDropdown = ({ value, onChange }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "auto",
        position: "fixed",
        top: "130px",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: "220px",
          left: "490px",
          right: "610px",
          height: "1px",
          bgcolor: "gray",
          zIndex: -1,
          bottompadding: "10px",
        }}
      />
      <Box
        sx={{
          position: "fixed",
          top: "205px",
          alignItems: "center",
          justifyContent: "flex-end",
          pr: 1,
          left: "600px",
          zIndex: 1,
          bottompadding: "10px",
        }}
      >
        <Typography variant="body2" sx={{ mr: -100, color: "gray" }}>
          Sort:
        </Typography>
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          input={<MinimalInput />}
          sx={{ bgcolor: "transparent", left: "465px", top: "-26px" }}
        >
          <MenuItem value="Popular">Popular</MenuItem>
          <MenuItem value="Recent">Date</MenuItem>
          <MenuItem value="Most Liked">Newest</MenuItem>
        </Select>
      </Box>
    </Box>
  );
};

export default SortDropdown;
