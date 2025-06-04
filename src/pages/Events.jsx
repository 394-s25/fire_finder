import React, { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import EventCardStudent from "../components/EventCardStudent";
import EventCardAdmin from "../components/EventCardAdmin";
import { useAuthContext } from "../services/userProvider";
import SearchBar from "../components/SearchBar";
import SortDropdown from "../components/Eventsdropdown";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firestoreConfig";
import { Tabs, Tab } from "@mui/material";
import { getUserRSVPedEvents, getUserSavedEvents, getUserPastAttendedEvents } from "../services/Events";
import { addDoc } from "firebase/firestore";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
} from "@mui/material";

const Events = () => {
  const eventsData = {
    "All Events": "All Events",
    "RSVP'd": "Upcoming Events",
    "Saved": "Saved Events",
    "Past Events": "Attended Events",
  };
  const [events, setEvents] = useState([]);
  const [tab, setTab] = useState(0);
  const [error, setError] = useState("");
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
      setError(""); // Reset error
      try {
        let data = [];
        const now = new Date();

        if (tab === 0) {
          const snapshot = await getDocs(collection(db, "events"));
          data = snapshot.docs.map((doc) => {
            const d = doc.data();
            return {
              type: "allevents",
              id: doc.id,
              title: d.title,
              description: d.description,
              location: d.location,
              imageUrl: d.imageUrl,
              startDate: d.startDate?.toDate(),
              endDate: d.endDate?.toDate(),
              rsvp: d.rsvp || [], // Add this to provide RSVP count
            };
          }).filter((event) => event.startDate && event.startDate > now);
        } else if (tab === 1) {
          // RSVP'd (Upcoming Events)
          data = await getUserRSVPedEvents();
          // Normalize data for EventCard
          data = data.map((event) => ({
            type: "rsvpd",
            id: event.id,
            title: event.title,
            description: event.description,
            location: event.location,
            imageUrl: event.imageUrl,
            startDate: event.startDate?.toDate(),
            endDate: event.endDate?.toDate(),
          }));
        } else if (tab === 2) {
          // Saved Events
          data = await getUserSavedEvents();
          data = data.map((event) => ({
            type: "saved",
            id: event.id,
            title: event.title,
            description: event.description,
            location: event.location,
            imageUrl: event.imageUrl,
            startDate: event.startDate?.toDate(),
            endDate: event.endDate?.toDate(),
          }));
        } else if (tab === 3) {
          // Past Events (Attended)
          data = await getUserPastAttendedEvents();
          data = data.map((event) => ({
            type: "past",
            id: event.id,
            title: event.title,
            description: event.description,
            location: event.location,
            imageUrl: event.imageUrl,
            startDate: event.startDate?.toDate(),
            endDate: event.endDate?.toDate(),
          }));
        }

        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setError("Failed to load events. Please try again.");
      }
    };
    fetchEvents();
  }, [tab]); // Re-fetch when tab changes

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

      if (tab === 0) {
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
      }

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
      <div>
        <div>
          {user?.isAdmin && tab === 0 && (
            <Button
              onClick={() => setOpenCreate(true)}
              sx={{
                border: "1px solid #f97316",
                color: "#f97316",
                textTransform: "none",
                position: "absolute",
                top: "90px",
                left: "80px",
                zIndex: 10,
              }}
            >
              + Create New Event
            </Button>
          )}
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            centered
            indicatorColor="primary"
            textColor="primary"
            sx={{ marginTop: "3rem" }}
          >
            <Tab label="All Events" />
            <Tab label="RSVP'd" />
            <Tab label="Saved" />
            <Tab label="Past Events" />
          </Tabs>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: ".5rem",
              marginBottom: "-1rem",
              padding: "0 1rem",
            }}
          >
            <h2>{eventsData[Object.keys(eventsData)[tab]]}</h2>
            <SearchBar />
          </div>
          <SortDropdown />
        </div>
        {error && (
          <div style={{ color: "red", textAlign: "center", margin: "1rem" }}>
            {error}
          </div>
        )}
        <div
          className="flex flex-col space-y-6"
          style={{ marginBottom: ".5rem" }}
        >
          {events.length === 0 && !error ? (
            <div style={{ textAlign: "center", margin: "1rem" }}>
              No events found.
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} style={{ marginBottom: "0.5rem" }}>
                {tab === 0 ? (
                  user?.isAdmin ? (
                    <EventCardAdmin
                      id={event.id}
                      title={event.title}
                      description={event.description}
                      location={event.location}
                      image={event.imageUrl}
                      startDate={event.startDate}
                      endDate={event.endDate}
                      rsvpCount={event.rsvp?.length || 0}
                    />
                  ) : (
                    <EventCardStudent
                      type={event.type}
                      id={event.id}
                      title={event.title}
                      description={event.description}
                      location={event.location}
                      image={event.imageUrl}
                      startDate={event.startDate}
                      endDate={event.endDate}
                    />
                  )
                ) : (
                  <EventCardStudent
                    type={event.type}
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
            ))
          )}
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