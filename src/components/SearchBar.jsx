import React from "react";
import { InputBase, styled } from "@mui/material";

const StyledInput = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    borderRadius: "25px",
    backgroundColor: "transparent",
    border: "2px solid #ddd",
    fontSize: 14,
    padding: "5px 15px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      borderColor: "#ddd",
      boxShadow: "0 0 0 0.2rem rgba(0,0,0,0.05)",
    },
  },
}));

const SearchBar = ({ value, onChange }) => {
  return (
    <StyledInput
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search"
    />
  );
};

export default SearchBar;