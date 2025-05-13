import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function PostsTabs() {
    const [value, setValue] = React.useState(0);
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    return (
        <Box sx={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
            <Tabs 
                value={value} 
                onChange={handleChange} 
                centered 
                sx={{
                    position: "fixed", 
                    top: { xs: '260px', sm: '100px', md: '100px' },
                    minHeight: '36px', // Reduce the overall tabs container height
                    '& .MuiTabs-indicator': {
                        backgroundColor: '#F97316', // Orange indicator
                    },
                    '& .Mui-selected': {
                        color: '#F97316 !important', // Orange text for selected tab
                    },
                    '& .MuiTab-root': {
                        minHeight: '36px', // Reduce each tab's height
                        padding: '6px 12px', // Smaller padding to reduce height
                        fontFamily: '"Times New Roman", Georgia, serif',
                        fontSize: { xs: '0.5rem', sm: '.8rem', md: '.8rem' },
                        // Remove focus outline
                        '&:focus': {
                            outline: 'none',
                        },
                        '&.Mui-focusVisible': {
                            outline: 'none',
                        }
                    }
                }}
            >
                <Tab label="Feed" />
                <Tab label="Saved" />
            </Tabs>
        </Box>
    );
}