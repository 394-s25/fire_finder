import React, { useState } from 'react';
import { Box, Typography, Select, MenuItem, InputBase, styled } from '@mui/material';

const MinimalInput = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input': {
        fontSize: 14,
        padding: '5px 26px 5px 12px',
        color: 'inherit',
        width: '100px', // Fixed width to prevent shifting
        textOverflow: 'ellipsis', // Handle overflow for long options
        whiteSpace: 'nowrap', // Prevent wrapping
        '&:focus': {
            backgroundColor: 'transparent',
        },
    },
    '& .MuiSelect-icon': {
        color: 'inherit',
    },
}));

const SortDropdown = () => {
    const [sortOption, setSortOption] = useState('Popular');

    const handleChange = (event) => {
        setSortOption(event.target.value);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                width: 'auto', // Let parent flex handle width
                position: 'fixed',
                top: '145px', // Adjusted to match the tabs
            }}
        >
            {/* Horizontal line */}
            <Box
                sx={{
                    position: 'fixed',
                    top: '160px', // Align with the tabs
                    left: '425px', // Adjusted to start from sidebar edge (300px - 50px buffer)
                    right: '450px',
                    height: '1px',
                    bgcolor: 'gray', // Match the "Sort" label color
                    zIndex: -1, // Ensure line is behind text
                }}
            />
            {/* Sort label and dropdown */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    pr: 1,
                    zIndex: 1,// Adjusted to align with the dropdown
                }}
            >
                
                <Typography variant="body2" sx={{ mr: -100, color: 'gray', }}>
                    Sort:
                </Typography>
                <Select
                    value={sortOption}
                    onChange={handleChange}
                    input={<MinimalInput />}
                    sx={{ bgcolor: 'transparent', left: '780px' }}
                >
                    <MenuItem value="Popular">Popular</MenuItem>
                    <MenuItem value="Latest">Latest</MenuItem>
                    <MenuItem value="Most Liked">Most Liked</MenuItem>
                </Select>
            </Box>
        </Box>
    );
};

export default SortDropdown;