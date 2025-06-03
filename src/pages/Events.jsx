import React, { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import { useAuthContext } from "../services/userProvider";
import EventCardStudent from "../components/EventCardStudent";
import EventCardAdmin from "../components/EventCardAdmin";
import SearchBar from "../components/SearchBar";
import placeholderImg from "../imgs/placeholder.jpeg";
import TradeExpo from "../imgs/TradeExpo.jpeg";
import CareerFair from "../imgs/CareerFair.jpg";
import SortDropdown from "../components/Eventsdropdown";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firestoreConfig";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
} from "@mui/material";
import { addDoc } from "firebase/firestore";

const Events = () => {
  const [events, setEvents] = useState([]);
  const { user } = useAuthContext();
  const [openCreate, setOpenCreate] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    location: "",
    imageUrl: "",
    startDate: "",
    endDate: "",
  });
  const [snackbarMsg, setSnackbarMsg] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "events"));
        const data = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            title: d.title,
            description: d.description,
            location: d.location,
            imageUrl: d.imageUrl,
            startDate: d.startDate?.toDate(),
            endDate: d.endDate?.toDate(),
            rsvp: d.rsvp || [],
          };
        });
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events: ", error);
      }
    };
    fetchEvents();
  }, []);
  const handleCreateEvent = async () => {
    try {
      const start = new Date(newEvent.startDate);
      const end = new Date(newEvent.endDate);

      const docRef = await addDoc(collection(db, "events"), {
        ...newEvent,
        startDate: start,
        endDate: end,
        rsvp: [],
      });

      setEvents((prev) => [
        ...prev,
        {
          ...newEvent,
          id: docRef.id,
          startDate: start,
          endDate: end,
          rsvp: [],
        },
      ]);

      setSnackbarMsg("Event created successfully.");
      setOpenCreate(false);
      setNewEvent({
        title: "",
        description: "",
        location: "",
        imageUrl: "",
        startDate: "",
        endDate: "",
      });
    } catch (error) {
      console.error("Failed to create event:", error);
      setSnackbarMsg("Error creating event.");
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div
          className="flex items-center justify-between mb-4"
          style={{ marginBottom: "0.5rem", marginTop: "4.5rem" }}
        >
          <SearchBar />
          {user?.isAdmin && (
            <Button
              onClick={() => setOpenCreate(true)}
              sx={{
                border: "1px solid #f97316",
                color: "#f97316",
                textTransform: "none",
                mb: 2, // ✅ margin-bottom: 3 spacing units
                alignSelf: "flex-start",
                position: "absolute",
                top: "95px", // Align with the tabs
                left: "80px",
              }}
            >
              + Create New Event
            </Button>
          )}
          <h2
            className="text-xl font-semibold"
            style={{
              color: "black",
              position: "absolute",
              //left: "190px",
              top: user?.isAdmin ? "140px" : "90px",
              marginBotton: "100px",
            }}
          >
            Upcoming Events
          </h2>
        </div>
        <SortDropdown />

        <div
          className="flex flex-col space-y-6"
          style={{
            marginBottom: "0.5rem",
            marginTop: user?.isAdmin ? "10.5rem" : "8.5rem", // ✅ Conditional marginTop
          }}
        >
          {events.map((event) => (
            <div key={event.id} style={{ marginBottom: "0.5rem" }}>
              {user?.isAdmin ? (
                <EventCardAdmin
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  location={event.location}
                  image={event.imageUrl} // ✅ Add this line
                  startDate={event.startDate}
                  endDate={event.endDate}
                  rsvpCount={event.rsvp?.length || 0}
                />
              ) : (
                <EventCardStudent
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  location={event.location}
                  image={event.imageUrl}
                  startDate={event.startDate}
                  endDate={event.endDate}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Title"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />
          <TextField
            label="Description"
            multiline
            minRows={3}
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
          />
          <TextField
            label="Location"
            value={newEvent.location}
            onChange={(e) =>
              setNewEvent({ ...newEvent, location: e.target.value })
            }
          />
          <TextField
            label="Image URL"
            value={newEvent.imageUrl}
            onChange={(e) =>
              setNewEvent({ ...newEvent, imageUrl: e.target.value })
            }
          />
          <TextField
            label="Start Date & Time"
            type="datetime-local"
            value={newEvent.startDate}
            onChange={(e) =>
              setNewEvent({ ...newEvent, startDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date & Time"
            type="datetime-local"
            value={newEvent.endDate}
            onChange={(e) =>
              setNewEvent({ ...newEvent, endDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button onClick={handleCreateEvent} sx={{ color: "#f97316" }}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Events;
