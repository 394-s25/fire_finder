import React from 'react';
import { InputBase, styled } from '@mui/material';

const StyledInput = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input': {
        borderRadius: '25px',
        backgroundColor: 'transparent',
        border: '1px solid #ddd',
        fontSize: 14,
        padding: '5px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
        borderColor: '#ddd',
        boxShadow: '0 0 0 0.2rem rgba(0,0,0,0.05)',
        },
    },
    }));

    const SearchBar = () => {
    return (
        <StyledInput
        placeholder="Search"
        sx={{ bgcolor: 'transparent',
            position: 'fixed',
            top: { xs: '270px', sm: '190px', md: '175px' },
            left: { xs: '10px', sm: '15px', md: '485px' },
            width: { xs: '90%', sm: '80%', md: '15%' },
        }}
        />
    );
};

export default SearchBar;