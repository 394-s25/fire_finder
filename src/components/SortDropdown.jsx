import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  InputBase,
  styled,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiSelect-select": {
    paddingRight: "28px",
    fontSize: "0.9rem",
    fontFamily: '"Times New Roman", Georgia, serif',
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
}));

const SortDropdown = () => {
  const [sortOption, setSortOption] = useState("Popular");

  const handleChange = (event) => {
    setSortOption(event.target.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          mr: 1,
          color: "gray",
          fontSize: "0.9rem",
          fontFamily: '"Times New Roman", Georgia, serif',
        }}
      >
        Sort:
      </Typography>
      <StyledSelect
        value={sortOption}
        onChange={handleChange}
        IconComponent={KeyboardArrowDownIcon}
        displayEmpty
        inputProps={{ "aria-label": "Sort by" }}
        size="small"
      >
        <MenuItem value="Popular">Popular</MenuItem>
        <MenuItem value="Recent">Date</MenuItem>
        <MenuItem value="Most Liked">Newest</MenuItem>
      </StyledSelect>
    </Box>
  );
};

export default SortDropdown;
