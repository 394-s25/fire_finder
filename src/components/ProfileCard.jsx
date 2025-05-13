import React from 'react';
import { Card, CardContent, CardMedia, Avatar, Typography } from '@mui/material';
import banner from '../imgs/banner.png'; // Adjust the path to your banner image 

const ProfileCard = () => {
    return (
        <Card
        sx={{
            position: 'fixed',
            top: { xs: '100px', sm: '110px', md: '110px' }, // Adjust top for smaller screens
            left: { xs: '0px', sm: '15px', md: '15px' }, // Adjust left margin for smaller screens
            width: { xs: '100%', sm: '325px', md: '325px' }, // Full width on mobile, 325px on larger screens
            height: { xs: 'auto', sm: '200px', md: '200px' }, // Auto height on mobile, fixed on larger screens
            backgroundColor: 'rgb(255, 251, 251)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            overflow: 'hidden', // Prevent overflow on smaller screens
        }}
        >
        <CardMedia
            sx={{
            height: { xs: '60px', sm: '80px', md: '80px' }, // Smaller banner on mobile
            width: '100%',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
            }}
            component="img"
            image={banner}
            alt="Banner Image"
        />
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Profile Picture */}
            <Avatar
            sx={{
                width: { xs: 50, sm: 70, md: 70 }, // Smaller avatar on mobile
                height: { xs: 50, sm: 70, md: 70 },
                marginTop: { xs: '-35px', sm: '-50px', md: '-50px' }, // Adjust margin for smaller avatar
                zIndex: 1,
                border: '3px solid white',
            }}
            alt="User Profile"
            src="" //pull email profile pic
            />

            {/* Username, pull from DB */}
            <Typography
            variant="h6"
            sx={{
                fontFamily: '"Times New Roman", Georgia, serif',
                fontWeight: 'bold',
                marginBottom: '4px',
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.25rem' }, // Responsive font size
            }}
            >
            USERNAME
            </Typography>

            {/* Bio, pull from DB */}
            <Typography
            variant="body2"
            sx={{
                marginTop: { xs: '-5px', sm: '-5px', md: '-5px' },
                fontFamily: '"Times New Roman", Georgia, serif',
                color: 'gray',
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.875rem' }, // Responsive font size
            }}
            >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Typography>
        </CardContent>
        </Card>
    );
};

export default ProfileCard;