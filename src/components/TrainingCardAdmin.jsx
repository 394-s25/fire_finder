import {
  Button,
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Snackbar,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../services/firestoreConfig";

export default function TrainingCardAdmin({ data }) {
  const [openDetails, setOpenDetails] = useState(false);
  const [accessList, setAccessList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const trainingRef = doc(db, "trainings", data.id);

  const handleViewDetails = async () => {
    setOpenDetails(true);
    setLoading(true);
    try {
      const snap = await getDoc(trainingRef);
      const trainingData = snap.data();
      const accessRefs = trainingData?.access || [];

      const accessData = await Promise.all(
        accessRefs.map(async (ref, index) => {
          try {
            const studentSnap = await getDoc(ref);
            const student = studentSnap.data();
            return {
              name: student?.displayName || "Unnamed",
              email: student?.email || "No email",
            };
          } catch (error) {
            console.error("Error fetching student:", error);
            return {
              name: "Error loading",
              email: "Error loading",
            };
          }
        })
      );

      setAccessList(accessData);
    } catch (err) {
      console.error("Failed to fetch training details:", err);
      setSnackbarMsg("Error loading training details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(trainingRef);
      setSnackbarMsg("Training deleted successfully.");
    } catch (err) {
      console.error("Error deleting training:", err);
      setSnackbarMsg("Failed to delete training.");
    }
  };

  return (
    <>
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: 1,
          backgroundColor: "white",
          border: "1px solid #ddd",
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
        <Box display="flex" justifyContent="flex-end" gap={1} px={2} pb={2}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<VisibilityIcon />}
            sx={{ borderColor: "#F26B3A", color: "#F26B3A" }}
            onClick={handleViewDetails}
          >
            View Details
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{ borderColor: "#F26B3A", color: "#F26B3A" }}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </Card>

      <Dialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {data.title || "Training Details"}
          <IconButton
            onClick={() => setOpenDetails(false)}
            sx={{ color: "black" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" gutterBottom>
            Instructor: {data.instructor || "Unknown"}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Duration: {data.duration || "TBD"}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {data.description}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Accessed by ({accessList.length})
          </Typography>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <List dense>
              {accessList.length === 0 ? (
                <Typography>
                  No students have accessed this training.
                </Typography>
              ) : (
                accessList.map((student, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={student.name}
                      secondary={student.email}
                    />
                  </ListItem>
                ))
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetails(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snackbarMsg}
        autoHideDuration={3000}
        onClose={() => setSnackbarMsg("")}
        message={snackbarMsg}
      />
    </>
  );
}
