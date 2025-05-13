import React, { useState } from 'react';
import { Modal, Box, TextField, IconButton, Button, Typography } from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';

const PostModal = ({ open, onClose }) => {
  const [postText, setPostText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleSend = () => {
    if (postText || selectedFiles.length > 0) {
      console.log('Post sent:', {
        text: postText,
        files: selectedFiles.map((file, index) => ({
          name: file.name,
          type: file.type,
        })),
      });
      setPostText('');
      setSelectedFiles([]);
      onClose();
    }
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(selectedFiles.filter((_, index) => index !== indexToRemove));
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
          Create Post
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="Write your post..."
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton component="label" sx={{ color: '#4CAF50' }}>
            <input
              type="file"
              hidden
              accept="image/*,video/*"
              multiple
              onChange={handleFileUpload}
            />
            <PhotoIcon />
          </IconButton>
          {selectedFiles.length > 0 && (
            <Box sx={{ ml: 1 }}>
              {selectedFiles.map((file, index) => (
                <Typography
                  key={index}
                  variant="caption"
                  sx={{ color: '#4CAF50', mr: 1 }}
                >
                  {file.name}{' '}
                  <span
                    style={{ cursor: 'pointer', color: 'red' }}
                    onClick={() => removeFile(index)}
                  >
                    [X]
                  </span>
                </Typography>
              ))}
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: 'gray' }}>
            {selectedFiles.length} file(s) selected
          </Typography>
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={!postText && selectedFiles.length === 0}
            sx={{ backgroundColor: 'rgb(175, 4, 4)', '&:hover': { backgroundColor: 'rgba(171, 67, 67, 0.8)' } }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PostModal;