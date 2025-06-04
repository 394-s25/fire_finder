import { useState } from "react";
import {
  Card,
  CardActionArea,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import placeholderImg from "../imgs/placeholder.jpeg";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firestoreConfig";
import { getDoc } from "firebase/firestore";

const EventCardAdmin = ({
  id,
  title,
  description,
  image,
  location,
  startDate,
  endDate,
  rsvpCount = 0,
}) => {
  const [openReschedule, setOpenReschedule] = useState(false);
  const [newStart, setNewStart] = useState(
    startDate?.toISOString().slice(0, 16)
  );
  const [newEnd, setNewEnd] = useState(endDate?.toISOString().slice(0, 16));
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const eventRef = doc(db, "events", id);
  const [openDetails, setOpenDetails] = useState(false);
  const [rsvpList, setRsvpList] = useState([]);
  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCancel = async (e) => {
    e.stopPropagation();
    await deleteDoc(eventRef);
    setSnackbarMsg("Event deleted.");
  };

  const handleReschedule = async () => {
    try {
      await updateDoc(eventRef, {
        startDate: new Date(newStart),
        endDate: new Date(newEnd),
      });
      setSnackbarMsg("Event rescheduled.");
    } catch (err) {
      console.error("Error rescheduling:", err);
      setSnackbarMsg("Failed to reschedule.");
    } finally {
      setOpenReschedule(false);
    }
  };

  const handleOpenDetails = async (e) => {
    e.stopPropagation();
    console.log("Opening details for event:", id);

    setOpenDetails(true); // Open modal immediately
    setLoading(true);

    try {
      const eventSnap = await getDoc(eventRef);
      const data = eventSnap.data();
      console.log("Event data:", data);

      const fetchStudents = async (entries = [], isSaved = false) => {
        if (!entries || entries.length === 0) return [];

        return Promise.all(
          entries.map(async (entry, index) => {
            try {
              let uid;

              // Determine UID format
              if (isSaved) {
                uid = entry; // Already just the uid
              } else if (typeof entry === "object" && entry?.id) {
                uid = entry.id; // Firestore DocumentReference
              } else if (typeof entry === "string") {
                uid = entry.split("/").pop(); // fallback for string
              } else {
                console.warn("Unrecognized entry format:", entry);
                return { name: "Invalid format", email: "Invalid format" };
              }

              console.log(
                `[${isSaved ? "saved" : "rsvp"}][${index}] UID:`,
                uid
              );
              const ref = doc(db, "students", uid);
              const snap = await getDoc(ref);
              const student = snap.data();

              return {
                name: student?.displayName || "Unnamed",
                email: student?.email || "No email",
              };
            } catch (err) {
              console.error("Error fetching student:", err);
              return {
                name: "Error loading",
                email: "Error loading",
              };
            }
          })
        );
      };

      const rsvps = await fetchStudents(data?.rsvp || []);
      const saved = await fetchStudents(data?.saved || []);

      console.log("RSVP list:", rsvps);
      console.log("Saved list:", saved);

      setRsvpList(rsvps);
      setSavedList(saved);
    } catch (err) {
      console.error("Error fetching event details:", err);
      setSnackbarMsg("Error loading event details");
    } finally {
      setLoading(false);
    }
  };

  const handleRescheduleClick = (e) => {
    e.stopPropagation();
    setOpenReschedule(true);
  };

  return (
    <>
      <Card className="mb-6 rounded-lg overflow-hidden">
        <CardActionArea sx={{ display: "flex", alignItems: "flex-start" }}>
          <div
            style={{
              width: "15rem",
              height: "15rem",
              flexShrink: 0,
              overflow: "hidden",
              borderRadius: "0.375rem",
            }}
          >
            <img
              src={image || placeholderImg}
              alt={`${title} image`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "fill",
                display: "block",
              }}
            />
          </div>

          <div
            style={{
              marginLeft: "0.75rem",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
            }}
          >
            <div style={{ marginBottom: "0.5rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 500 }}>{title}</h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  marginTop: "-0.5rem",
                }}
              >
                {startDate?.toLocaleString()} - {endDate?.toLocaleString()}
              </p>
            </div>

            <div
              style={{
                fontSize: "0.875rem",
                color: "#4b5563",
                marginBottom: "0.75rem",
              }}
            >
              {location}
            </div>

            <div
              style={{
                fontSize: "0.875rem",
                color: "#4b5563",
                marginBottom: "0.75rem",
              }}
            >
              {description.split("\n").map((line, index) => (
                <p key={index} style={{ margin: 0 }}>
                  {line}
                </p>
              ))}
            </div>

            <div
              style={{
                fontSize: "0.875rem",
                color: "#4b5563",
                marginBottom: "0.75rem",
              }}
            >
              RSVPs: {rsvpCount}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                paddingBottom: "0.5rem",
                paddingRight: "0.5rem",
                paddingLeft: "0.5rem",
                gap: "0.5rem",
              }}
            >
              <Button
                variant="outlined"
                size="small"
                sx={{ borderColor: "#f97316", color: "#f97316" }}
                onClick={handleOpenDetails}
              >
                View Details
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<CalendarMonthIcon />}
                sx={{ borderColor: "#f97316", color: "#f97316" }}
                onClick={handleRescheduleClick}
              >
                Reschedule
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<CancelIcon />}
                sx={{ borderColor: "#f97316", color: "#f97316" }}
                onClick={handleCancel}
              >
                Cancel Event
              </Button>
            </div>
          </div>
        </CardActionArea>
      </Card>

      {/* Reschedule Dialog */}
      <Dialog open={openReschedule} onClose={() => setOpenReschedule(false)}>
        <DialogTitle>Reschedule Event</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Start Date & Time"
            type="datetime-local"
            value={newStart}
            onChange={(e) => setNewStart(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date & Time"
            type="datetime-local"
            value={newEnd}
            onChange={(e) => setNewEnd(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReschedule(false)}>Cancel</Button>
          <Button onClick={handleReschedule} sx={{ color: "#f97316" }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={!!snackbarMsg}
        autoHideDuration={3000}
        onClose={() => setSnackbarMsg("")}
        message={snackbarMsg}
      />

      {/* Details Dialog */}
      <Dialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {title}
          <IconButton
            onClick={() => setOpenDetails(false)}
            sx={{
              color: "black",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Typography variant="subtitle2" gutterBottom>
            {startDate?.toLocaleString()} – {endDate?.toLocaleString()}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Location: {location}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {description}
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>
            RSVP'd Students
          </Typography>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <List dense>
              {rsvpList.length === 0 ? (
                <Typography>No students have RSVP'd.</Typography>
              ) : (
                rsvpList.map((student, index) => (
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

          <Typography variant="h6" sx={{ mt: 2 }}>
            Saved by
          </Typography>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <List dense>
              {savedList.length === 0 ? (
                <Typography>No students have saved this event.</Typography>
              ) : (
                savedList.map((student, index) => (
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
    </>
  );
};

export default EventCardAdmin;
