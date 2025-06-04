import {
  Button,
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
  IconButton,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { auth, db } from "../services/firestoreConfig";
import { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function TrainingCard({ data, savedTrainings = [], setSavedTrainings }) {
  const user = auth.currentUser;
  const isSaved = savedTrainings.some((t) => t.id === data.id);

  const toggleBookmark = async () => {
    if (!user) return;
    const studentRef = doc(db, "students", user.uid);
    const trainingRef = doc(db, "trainings", data.id);
    const studentSnap = await getDoc(studentRef);
    const currentTrainings = studentSnap.data()?.trainings || [];
    const alreadySaved = currentTrainings.some(
      (ref) => ref.path === trainingRef.path
    );
    const updatedRefs = alreadySaved
      ? currentTrainings.filter((ref) => ref.path !== trainingRef.path)
      : [...currentTrainings, trainingRef];
    await updateDoc(studentRef, { trainings: updatedRefs });
    setSavedTrainings((prev) =>
      alreadySaved ? prev.filter((t) => t.id !== data.id) : [...prev, data]
    );
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 1,
        backgroundColor: "white",
        border: "1px solid #ddd",
        position: "relative",
      }}
    >
      <Box sx={{ px: 2, pt: 1 }}>
        <Chip
          label={data.topic || "Training Topic"}
          sx={{
            backgroundColor: "#B55050",
            color: "white",
            fontSize: "0.75rem",
          }}
          size="small"
        />
        <IconButton
          onClick={toggleBookmark}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          {isSaved ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
        </IconButton>
      </Box>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {data.title || "Training Title"}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {data.instructor || "Instructor or Institution"}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Duration: {data.duration || "TBD"}
        </Typography>
        <Typography variant="body2">
          {data.description || "Short description of the training resource."}
        </Typography>
      </CardContent>
      <Box display="flex" justifyContent="flex-end" px={2} pb={2}>
        <Button
          size="small"
          variant="contained"
          sx={{ backgroundColor: "#F26B3A" }}
        >
          Access
        </Button>
      </Box>
    </Card>
  );
}