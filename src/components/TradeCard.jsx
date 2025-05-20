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
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function TradeCard({ data, savedTrades = [], setSavedTrades }) {
  const user = auth.currentUser;
  const isSaved = savedTrades.some((t) => t.id === data.id);

  const toggleBookmark = async () => {
    if (!user) return;
    const studentRef = doc(db, "students", user.uid);
    const tradeRef = doc(db, "trades", data.id);
    const studentSnap = await getDoc(studentRef);
    const currentInterests = studentSnap.data()?.interests || [];
    const alreadySaved = currentInterests.some(
      (ref) => ref.path === tradeRef.path
    );
    const updatedRefs = alreadySaved
      ? currentInterests.filter((ref) => ref.path !== tradeRef.path)
      : [...currentInterests, tradeRef];
    await updateDoc(studentRef, { interests: updatedRefs });
    setSavedTrades((prev) =>
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
          label={data.category || "Trade Category"}
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
          {data.name || "Trade Name"}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {data.description || "Brief description of what this trade involves."}
        </Typography>
      </CardContent>
      <Box display="flex" justifyContent="flex-end" px={2} pb={2}>
        <Button
          size="small"
          variant="contained"
          sx={{ backgroundColor: "#F26B3A" }}
        >
          Learn More
        </Button>
      </Box>
    </Card>
  );
}
