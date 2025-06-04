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
    width: "100px", // Fixed width to prevent shifting
    textOverflow: "ellipsis", // Handle overflow for long options
    whiteSpace: "nowrap", // Prevent wrapping
    "&:focus": {
      backgroundColor: "transparent",
    },
  },
  "& .MuiSelect-icon": {
    color: "inherit",
  },
}));

const SortDropdown = () => {
  const [sortOption, setSortOption] = useState("Popular");

  const handleChange = (event) => {
    setSortOption(event.target.value);
  };
  
  return (
      <Box
        sx = {{
          alignItems: 'center', display:"flex", justifyContent: "flex-start", flexDirection :"row"}}>
        <Box
          sx={{
            width: "100%",
            height: "1px",
            bgcolor: 'rgba(0, 0, 0, 0.2)',
          }}
        />
        <Typography variant="body2" sx = {{ ml:1}}>
          Sort:
        </Typography>
        <Select
          value={sortOption}
          onChange={handleChange}
          input={<MinimalInput />}
          sx={{ bgcolor: "transparent", }}
        >
          <MenuItem value="Popular">Popular</MenuItem>
          <MenuItem value="Date">Date</MenuItem>
          <MenuItem value="Newest">Newest</MenuItem>
        </Select>
      </Box>
  );
};

export default SortDropdown;