import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../imgs/logo.png'; // Adjust the path to your logo image
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import LocalActivityOutlinedIcon from '@mui/icons-material/LocalActivityOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useNavigate, useLocation } from 'react-router-dom';


const Navbar = () => {

    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };


    const location = useLocation();
    const navigate = useNavigate();
    const routeTitles = {
        '/': 'Explore',
        '/profile': 'Profile',
        '/resources': 'Resources',
        '/events': 'Events',
    };
    const handleNavigation = (path) => {
    navigate(path);
    togglePanel(); // Close the panel after navigation
    };
    const currentTitle = routeTitles[location.pathname]

    return (
        //left(logo), mid(page title), right(menu)
        <>
        <AppBar
            position="fixed"
            sx={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 1100 }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-middle' }}> 
                    <Typography variant="h15" sx={{ color: '#DC2626', fontWeight: 'bold', fontFamily: '"Times New Roman", Georgia, serif' }}>
                        FireFinder
                    </Typography>
                    
                    <img src={logo} alt="TC logo" style={{ width: 45, height: 50, marginLeft: 10, marginBottom: 3}} />
                </div>
                
                <Typography variant="h4" sx={{ color: '#DC2626', fontWeight: 600, fontFamily: '"Times New Roman", Georgia, serif' }}>
                    {currentTitle}
                </Typography>
                
                <IconButton edge="end" aria-label="menu" onClick={togglePanel} sx={{ marginRight: 1 }}>
                    <MenuIcon sx={{ color: '#DC2626', alignItems: 'middle' }} />
                </IconButton>
            </Toolbar>
        </AppBar>
        <Drawer
        anchor="right"
        open={isPanelOpen}
        onClose={togglePanel}
        sx={{
            zIndex: 1500,
            '& .MuiDrawer-paper': {
                width: '100px',
                backgroundColor: 'white',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                marginTop: '80px',
            },
            }}
        >
            <List sx={{ width: '100%' }}>
            <ListItem button onClick={() => handleNavigation('/profile')} sx={{ flexDirection: 'column', alignItems: 'center', 
                backgroundColor: location.pathname === '/profile' ? '#FEE2E2' : 'transparent', }}>
                <>
                <AccountCircleIcon sx={{ color: '#DC2626'}} />
                <ListItemText primary="Profile" sx={{ color: '#DC2626', fontSize: 10}} />
                </>
            </ListItem><ListItem button onClick={() => handleNavigation('/resources')} sx={{ flexDirection: 'column', alignItems: 'center', 
                backgroundColor: location.pathname === '/resources' ? '#FEE2E2' : 'transparent', }}>
                <>
                <GroupsOutlinedIcon sx={{ color: '#DC2626'}} />
                <ListItemText primary="Resources" sx={{ color: '#DC2626', fontSize: 10}} />
                </>
            </ListItem><ListItem button onClick={() => handleNavigation('/events')} sx={{ flexDirection: 'column', alignItems: 'center', 
                backgroundColor: location.pathname === '/events' ? '#FEE2E2' : 'transparent', }}>
                <>
                <LocalActivityOutlinedIcon sx={{ color: '#DC2626'}} />
                <ListItemText primary="Events" sx={{ color: '#DC2626', fontSize: 10}} />
                </>
            </ListItem><ListItem button onClick={() => handleNavigation('/')} sx={{ flexDirection: 'column', alignItems: 'center', 
                backgroundColor: location.pathname === '/' ? '#FEE2E2' : 'transparent', }}>
                <>
                <HomeOutlinedIcon sx={{ color: '#DC2626'}} />
                <ListItemText primary="Explore" sx={{ color: '#DC2626', fontSize: 10}} />
                </>
            </ListItem>
            </List>
        </Drawer>
        </>
    );
};

export default Navbar;
