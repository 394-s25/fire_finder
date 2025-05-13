import React, { useState } from 'react';
import { Modal, Box, TextField, IconButton, Button, Typography } from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';

const EventModal = ({ open, onClose }) => {
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handlePublish = () => {
    if (eventTitle && eventDate && (eventDescription || selectedFile)) {
      console.log('Event published:', {
        title: eventTitle,
        date: eventDate,
        description: eventDescription,
        file: selectedFile ? { name: selectedFile.name, type: selectedFile.type } : null,
      });
      setEventTitle('');
      setEventDate('');
      setEventDescription('');
      setSelectedFile(null);
      onClose();
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
          label="Event Date"
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
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
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton component="label" sx={{ color: '#FF9800' }}>
            <input
              type="file"
              hidden
              accept="image/*,video/*"
              onChange={handleFileUpload}
            />
            <PhotoIcon />
          </IconButton>
          {selectedFile && (
            <Typography variant="caption" sx={{ ml: 1, color: '#FF9800' }}>
              {selectedFile.name}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: 'gray' }}>
            {selectedFile ? '1 file selected' : 'No file selected'}
          </Typography>
          <Button
            variant="contained"
            onClick={handlePublish}
            disabled={!eventTitle || !eventDate || (!eventDescription && !selectedFile)}
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