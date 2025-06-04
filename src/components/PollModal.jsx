import React, { useState } from 'react';
import { Modal, Box, TextField, IconButton, Button, Typography, Select, MenuItem, FormControl, InputLabel, Switch, FormControlLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firestoreConfig";
import { useAuthContext } from "../services/userProvider";

const PollModal = ({ open, onClose }) => {
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '']); // Start with 2 options
    const [hasLimitedDuration, setHasLimitedDuration] = useState(false);
    const [pollDuration, setPollDuration] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuthContext();
    const MAX_OPTIONS = 6;

    const handleOptionChange = (index, value) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };

    const addOption = () => {
        if (pollOptions.length < MAX_OPTIONS) {
            setPollOptions([...pollOptions, '']);
        }
    };

    const removeOption = (index) => {
        if (pollOptions.length > 2) { // Ensure at least 2 options remain
            setPollOptions(pollOptions.filter((_, i) => i !== index));
        }
    };

    const handlePublish = async () => {
        if (!user || !pollQuestion.trim() || pollOptions.some(option => option.trim() === '')) {
            return;
        }

        if (hasLimitedDuration && !['1', '3', '7'].includes(pollDuration)) {
            alert('Please select a duration');
            return;
        }

        setIsSubmitting(true);

        try {
            const pollEndTime = hasLimitedDuration 
                ? new Date(Date.now() + parseInt(pollDuration) * 24 * 60 * 60 * 1000)
                : null;

            const postData = {
                text: pollQuestion.trim(),
                authorId: user.uid,
                authorName: user.displayName || user.email || "Anonymous",
                authorEmail: user.email,
                timestamp: serverTimestamp(),
                likes: 0,
                likedBy: [],
                comments: 0,
                saves: 0,
                savedBy: [],
                // Poll-specific fields
                isPoll: true,
                pollOptions: pollOptions.map(option => ({
                    text: option.trim(),
                    votes: 0,
                    votedBy: []
                })),
                pollDuration: hasLimitedDuration ? parseInt(pollDuration) : null,
                pollEndTime: pollEndTime
            };

            const docRef = await addDoc(collection(db, "posts"), postData);
            console.log("Poll post created with ID:", docRef.id);

            // Reset form
            setPollQuestion('');
            setPollOptions(['', '']);
            setHasLimitedDuration(false);
            setPollDuration('');

            onClose();
        } catch (error) {
            console.error("Error creating poll:", error);
            alert("Error creating poll. Please try again.");
        } finally {
            setIsSubmitting(false);
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
                    Create Poll
                </Typography>
                <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={hasLimitedDuration}
                                onChange={(e) => setHasLimitedDuration(e.target.checked)}
                                disabled={isSubmitting}
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: 'rgb(175, 4, 4)',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: 'rgb(175, 4, 4)',
                                    },
                                }}
                            />
                        }
                        label="Limited Duration"
                    />
                    {hasLimitedDuration && (
                        <FormControl fullWidth sx={{ mt: 1 }}>
                            <InputLabel>Duration</InputLabel>
                            <Select
                                value={pollDuration}
                                onChange={(e) => setPollDuration(e.target.value)}
                                label="Duration"
                                disabled={isSubmitting}
                            >
                                <MenuItem value="1">1 day</MenuItem>
                                <MenuItem value="3">3 days</MenuItem>
                                <MenuItem value="7">7 days</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                </Box>
                <TextField
                    fullWidth
                    label="Poll Question"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    disabled={isSubmitting}
                />
                {pollOptions.map((option, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TextField
                            fullWidth
                            label={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            variant="outlined"
                            sx={{ mr: 1 }}
                            disabled={isSubmitting}
                        />
                        {index >= 2 && (
                            <IconButton
                                onClick={() => removeOption(index)}
                                sx={{ color: 'rgb(120, 60, 60)' }}
                                disabled={isSubmitting}
                            >
                                <CloseIcon />
                            </IconButton>
                        )}
                    </Box>
                ))}
                {pollOptions.length < MAX_OPTIONS && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                        <Button
                            startIcon={<AddIcon />}
                            onClick={addOption}
                            sx={{ color: 'rgb(120, 60, 60)', textTransform: 'none' }}
                            disabled={isSubmitting}
                        >
                            Add Option
                        </Button>
                    </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        onClick={handlePublish}
                        disabled={!pollQuestion || pollOptions.some(option => option.trim() === '') || isSubmitting}
                        sx={{ 
                            backgroundColor: 'rgb(175, 4, 4)', 
                            '&:hover': { backgroundColor: 'rgba(171, 67, 67, 0.8)' },
                            '&:disabled': { backgroundColor: 'rgba(175, 4, 4, 0.5)' }
                        }}
                    >
                        {isSubmitting ? 'Publishing...' : 'Publish'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default PollModal;