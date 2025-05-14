import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardMedia, Box, Typography, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';

const PostCard = () => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const handleLikeToggle = () => {
        setLiked((prev) => !prev);
        setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    };

    // Placeholder data
    const placeholderText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus, augue eget scelerisque efficitur. Vivamus nec justo non nunc sodales sollicitudin. Integer id magna nec risus feugiat aliquet.';
    const placeholderFiles = [
        '/path/to/sample-image1.jpg',
        '/path/to/sample-image2.jpg',
        '/path/to/sample-image3.jpg',
        '/path/to/sample-image4.jpg',
        '/path/to/sample-image5.jpg',
        '/path/to/sample-image6.jpg',
        '/path/to/sample-image7.jpg',
    ]; // Up to 7 placeholder images

    return (
        <Card sx={{ mb: 2, border: '1px solid #ddd', borderRadius: 2, width: '100%', maxWidth: '700px', top: '150px', left: '50px', position: 'relative', zIndex: -1}}>
        {/* Profile Section */}
        <CardHeader
            avatar={
            <img
                src="/path/to/avatar.png"
                alt="User"
                style={{ width: 70, height: 70, borderRadius: 5 }} // Rectangle
            />
            }
            title={
            <Box sx={{ display: 'flex', alignItems: 'start', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>Your Name</Typography>
                <Typography variant="caption" sx={{ fontSize: '0.8rem' }}>26,548 followers</Typography>
            </Box>
            }
            sx={{ pb: 0.5, pt: 1.5 }} // Adjusted padding for slight length increase
        />
        {/* Post Text and Images */}
        <CardContent sx={{ pt: 1.5, pb: 1.5, pl: 1.5, pr: 1.5 }}> {/* Increased padding for slight length increase */}
            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>{placeholderText}</Typography>
        </CardContent>
        {placeholderFiles.length > 0 && (
            <Box
            sx={{
                display: 'flex',
                overflowX: 'auto',
                '&::-webkit-scrollbar': {
                height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                },
                '&::-webkit-scrollbar-thumb': {
                background: 'rgb(120, 60, 60)', // Reddish-maroon
                borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                background: 'rgb(140, 70, 60)',
                },
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgb(120, 60, 60) #f1f1f1',
                scrollSnapType: 'x mandatory',
            }}
            >
            {placeholderFiles.map((file, index) => (
                <CardMedia
                key={index}
                component="img"
                sx={{
                    flex: '0 0 auto',
                    width: '300px',
                    height: '350px',
                    objectFit: 'cover',
                    scrollSnapAlign: 'center',
                    pr: 0.5,
                    pl: 0.5
                }}
                image={file}
                alt={`Post image ${index + 1}`}
                />
            ))}
            </Box>
        )}
        {/* Action Icons */}
        <Box
            sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1,
            px: 2,
            borderTop: '1px solid #ddd',
            pt: 1.5, // Increased padding for slight length increase
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleLikeToggle}>
                <FavoriteIcon sx={{ color: liked ? 'rgb(175, 4, 4)' : 'gray' }} />
            </IconButton>
            <Typography variant="caption" sx={{ ml: 0.5 }}>
                {likeCount}
            </Typography>
            </Box>
            <IconButton>
            <BookmarkIcon sx={{ color: 'rgb(120, 60, 60)' }} />
            </IconButton>
            <IconButton>
            <ShareIcon sx={{ color: 'rgb(120, 60, 60)' }} />
            </IconButton>
        </Box>
        </Card>
    );
    };

export default PostCard;