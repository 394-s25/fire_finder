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
    <Tabs 
        value={value} 
        onChange={handleChange} 
        centered 
        textColor= 'secondary'
        indicatorColor = 'secondary'
        sx={{position:"fixed", top: '100px' ,height: '50px' }}>
            <Tab label="Feed" />
            <Tab label="Saved" />
        </Tabs>
    );
}
