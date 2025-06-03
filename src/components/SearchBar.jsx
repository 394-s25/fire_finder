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
<<<<<<< HEAD
=======
      sx={{
        bgcolor: "transparent",
        position: "fixed",
        top: { xs: "260px", sm: "190px", md: "95px" },
        left: { xs: "10px", sm: "15px", md: "1100px" },
        width: { xs: "90%", sm: "80%", md: "15%" },
        bottompadding: "15px",
        zIndex: -1,
      }}
>>>>>>> 65a11e4afcad14f8cf5f82851155c39267abfb39
    />
  );
};

export default SearchBar;
