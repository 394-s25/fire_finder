import {
  Avatar,
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { auth, db } from "../services/firestoreConfig";
import { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function ContactCard({ data, savedContacts = [], setSavedContacts }) {
  const user = auth.currentUser;
  const isSaved = savedContacts.some((c) => c.id === data.id);

  const toggleBookmark = async () => {
    if (!user) return;
    const studentRef = doc(db, "students", user.uid);
    const contactRef = doc(db, "contacts", data.id);
    const studentSnap = await getDoc(studentRef);
    const currentContacts = studentSnap.data()?.contacts || [];
    const alreadySaved = currentContacts.some(
      (ref) => ref.path === contactRef.path
    );
    const updatedRefs = alreadySaved
      ? currentContacts.filter((ref) => ref.path !== contactRef.path)
      : [...currentContacts, contactRef];
    await updateDoc(studentRef, { contacts: updatedRefs });
    setSavedContacts((prev) =>
      alreadySaved ? prev.filter((c) => c.id !== data.id) : [...prev, data]
    );
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 1,
        backgroundColor: "white",
        border: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        p: 2,
        position: "relative",
      }}
    >
      <IconButton
        onClick={toggleBookmark}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        {isSaved ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
      </IconButton>
      <Avatar
        alt={data.name}
        src={data.image || ""}
        sx={{ width: 64, height: 64, mb: 2 }}
      />
      <CardContent sx={{ p: 0 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {data.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.role || "Outreach Coordinator"}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {data.email}
        </Typography>
        <Typography variant="body2">{data.phone}</Typography>
      </CardContent>

      <Box mt={2} display="flex" gap={1}>
        <Button
          size="small"
          variant="contained"
          sx={{ backgroundColor: "#F26B3A" }}
          href={`mailto:${data.email}`}
        >
          Contact
        </Button>
        {user?.isAdmin && (
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => onDelete?.(data.id)}
          >
            Delete
          </Button>
        )}
      </Box>
    </Card>
  );
}