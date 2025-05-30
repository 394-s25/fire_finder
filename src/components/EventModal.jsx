import React, { useState } from 'react';
import { Modal, Box, TextField, IconButton, Button, Typography } from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';
import { createEvent } from '../services/Events';

const EventModal = ({ open, onClose }) => {
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventEndDate, setEventEndDate] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
        setSelectedFile(file);
        if (file.type.startsWith('image/')) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            setSelectedFile(null); // Reject non-image files
            setImagePreview(null);
            setError('Please select an image file');
        }
        }
    };

    const handleClearImage = () => {
        setSelectedFile(null);
        setImagePreview(null);
    };

    const handlePublish = async () => {
        setError(''); 
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Add 1 and pad
        const day = String(today.getDate()).padStart(2, '0'); // Pad
        const currentDate = new Date(`${year}-${month}-${day}`).getTime(); // Midnight today

        const selectedDate = new Date(eventDate).getTime();
        const selectedEndDate = new Date(eventEndDate).getTime();
        

        if (!eventTitle || !eventDate || !eventEndDate || !eventDescription) {
            setError('Please fill in all required fields');
            return;
        }

        if (selectedDate < currentDate) {
            alert('Ensure date is correct');
            return;
        }

        if (selectedDate > selectedEndDate) {
            setError('End date must be after start date');
            return;
        }

        try {
            const eventData = {
                title: eventTitle,
                startDate: eventDate,
                endDate: eventEndDate,
                location: eventLocation,
                description: eventDescription,
            };

            await createEvent(eventData, selectedFile);

            // Reset form on success
            setEventTitle('');
            setEventDate('');
            setEventEndDate('');
            setEventLocation('');
            setEventDescription('');
            setSelectedFile(null);
            setImagePreview(null);
            onClose();
        } catch (error) {
            setError(error.message || 'Failed to create event');
        }
        };
        
    return (
        <Modal open={open} onClose={onClose}>
        <Box
            sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '500px', md: '500px' },
            maxHeight: '80vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: { xs: 2, sm: 3, md: 3 },
            borderRadius: '8px',
            overflowY: 'auto',
            }}
        >
            <Typography variant="h6" sx={{ mb: 2, fontFamily: '"Times New Roman", Georgia, serif', color: 'rgb(175, 4, 4)' }}>
            Create Event
            </Typography>
            {error && (
            <Typography color="error" sx={{ mb: 2 }}>
                {error}
            </Typography>
            )}
            <Box
            sx={{
                border: '1px solid rgba(0, 0, 0, 0.23)', // Matches TextField outlined border
                borderRadius: '4px',
                p: 1,
                mb: 2,
            }}
            >
            <Typography variant="subtitle1" sx={{ mb: 1, color: 'black' }}>
                Event Banner Image (Optional)
            </Typography>
            <IconButton component="label" sx={{ color: 'rgb(120, 60, 60)' }}>
                <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileUpload}
                />
                <PhotoIcon />
            </IconButton>
            {selectedFile && (
                <Box sx={{ mt: 1 }}>
                {imagePreview && (
                    <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
                    />
                )}
                </Box>
            )}
            {selectedFile && (
                <Typography variant="caption" sx={{ color: 'gray', mr: 1 }}>
                {selectedFile.name}
                </Typography>
            )}
            <Typography variant="caption" sx={{ color: 'gray' }}>
                {selectedFile ? (
                <>
                    1 image selected{' '}
                    <span
                    style={{ cursor: 'pointer', color: 'rgb(175, 4, 4)', ml: 1 }}
                    onClick={handleClearImage}
                    >
                    [Clear]
                    </span>
                </>
                ) : (
                'No image selected'
                )}
            </Typography>
            </Box>
            <TextField
            fullWidth
            label="Event Title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
            />
            <TextField
            fullWidth
            label="Event Start Date-Time"
            type="datetime-local"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
            />
            <TextField
            fullWidth
            label="Event End Date-Time"
            type="datetime-local"
            value={eventEndDate}
            onChange={(e) => setEventEndDate(e.target.value)}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
            />
            <TextField
            fullWidth
            label="Location"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
            />
            <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            variant="outlined"
            placeholder="Include times, agenda, special guests, any offerings (e.g free food, merch, etc.) , how to get there, contacts etc."
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button
                variant="contained"
                onClick={handlePublish}
                disabled={!eventTitle || !eventDate || !eventEndDate || !eventDescription}
                sx={{ backgroundColor: 'rgb(175, 4, 4)', '&:hover': { backgroundColor: 'rgba(171, 67, 67, 0.8)' } }}
            >
                Publish
            </Button>
            </Box>
        </Box>
        </Modal>
    );
};

export default EventModal;