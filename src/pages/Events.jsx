import React, { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import EventCard from "../components/EventCard";
import SearchBar from "../components/SearchBar";
import SortDropdown from "../components/Eventsdropdown";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firestoreConfig";
import { Tabs, Tab } from "@mui/material";
import { getUserRSVPedEvents, getUserSavedEvents, getUserPastAttendedEvents } from "../services/Events";

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

  useEffect(() => {
    const fetchEvents = async () => {
      setError(""); // Reset error
      try {
        let data = [];

        if (tab === 0) {
          // All Events
          const snapshot = await getDocs(collection(db, "events"));
          data = snapshot.docs.map((doc) => {
            const d = doc.data();
            return {
              id: doc.id,
              title: d.title,
              description: d.description,
              location: d.location,
              imageUrl: d.imageUrl,
              startDate: d.startDate?.toDate(),
              endDate: d.endDate?.toDate(),
            };
          });
        } else if (tab === 1) {
          // RSVP'd (Upcoming Events)
          data = await getUserRSVPedEvents();
          // Normalize data for EventCard
          data = data.map((event) => ({
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

  return (
    <>
      <Navbar />
      <div>
        <div>
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
        <div className="flex flex-col space-y-6" style={{ marginBottom: ".5rem" }}>
          {events.length === 0 && !error ? (
            <div style={{ textAlign: "center", margin: "1rem" }}>
              No events found.
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} style={{ marginBottom: "0.5rem" }}>
                <EventCard
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  location={event.location}
                  image={event.imageUrl} // Map imageUrl to image
                  startDate={event.startDate}
                  endDate={event.endDate}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Events;