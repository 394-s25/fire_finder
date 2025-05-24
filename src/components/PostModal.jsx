import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, IconButton, Button, Typography } from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';
import CloseIcon from '@mui/icons-material/Close';

const PostModal = ({ open, onClose }) => {
  const [postText, setPostText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [showImageOverlay, setShowImageOverlay] = useState(false);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files).filter(file => file.type.startsWith('image/'));
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };
  
  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setImagePreviews(newPreviews);
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
      setImagePreviews([]);
      onClose();
    }
  };

  const handleOverlayClose = () => {
    setShowImageOverlay(false);
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  return (
    <>
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
            <IconButton component="label" sx={{ color: 'rgb(120, 60, 60)' }}>
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={handleFileUpload}
              />
              <PhotoIcon />
            </IconButton>
            <Typography variant="caption" sx={{ color: 'gray', ml: 1 }}>
              {selectedFiles.length} image(s) selected
            </Typography>
          </Box>
          {imagePreviews.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 1,
                  maxWidth: '300px',
                }}
              >
                {imagePreviews.slice(0, 4).map((preview, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: 'relative',
                      width: '100%',
                      paddingTop: '100%', // 1:1 aspect ratio
                      border: '1px solid rgba(0, 0, 0, 0.23)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {index === 3 && selectedFiles.length > 4 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          bgcolor: 'rgba(0, 0, 0, 0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                        onClick={() => setShowImageOverlay(true)}
                      >
                        <Typography sx={{ color: 'white', fontSize: '1.2rem' }}>
                          +{selectedFiles.length - 4}
                        </Typography>
                      </Box>
                    )}
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
                      }}
                      onClick={() => removeFile(index)}
                    >
                      <CloseIcon fontSize="small" sx={{ color: 'red' }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: 'gray' }}>
              {selectedFiles.length} image(s) selected
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
      <Modal open={showImageOverlay} onClose={handleOverlayClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: '1000px',
            bgcolor: 'white',
            borderRadius: '8px',
            p: 1,
            display: 'flex',
            overflowX: 'auto',
            // Scrollbar styling for WebKit browsers
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
              background: 'rgb(140, 70, 70)',
            },
            // Scrollbar styling for Firefox
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgb(120, 60, 60) #f1f1f1',
          }}
        >
          {imagePreviews.map((preview, index) => (
            <Box
              key={index}
              sx={{
                position: 'relative',
                flex: '0 0 auto',
                width: '150px',
                height: '150px',
                mr: 1,
                border: '1px solid rgba(0, 0, 0, 0.23)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <img
                src={preview}
                alt={`Preview ${index}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
                }}
                onClick={() => removeFile(index)}
              >
                <CloseIcon fontSize="small" sx={{ color: 'red' }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Modal>
    </>
  );
};

export default PostModal;