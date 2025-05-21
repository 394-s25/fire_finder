import React from "react";
import { InputBase, styled } from "@mui/material";

const StyledInput = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    borderRadius: "25px",
    backgroundColor: "transparent",
    border: "1px solid #ddd",
    fontSize: 14,
    padding: "5px 15px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      borderColor: "#ddd",
      boxShadow: "0 0 0 0.2rem rgba(0,0,0,0.05)",
    },
  },
}));

const SearchBar = () => {
  return (
    <StyledInput
      placeholder="Search"
      fullWidth
      sx={{
        bgcolor: "transparent",
        width: "100%",
      }}
    />
  );
};

export default SearchBar;
