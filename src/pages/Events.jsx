import React, { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import EventCard from "../components/EventCard";
import SearchBar from "../components/SearchBar";
import SortDropdown from "../components/Eventsdropdown";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firestoreConfig";
import { Tabs, Tab } from "@mui/material";
import MediaCard from "../components/EventDetails";

const Events = () => {
  const eventsData = {
    "All Events":  "All Events",
    "RSVP'd": "Upcoming Events",
    "Saved": "Saved Events",
    "Past Events": "Attended Events",
  };
  const [events, setEvents] = useState([]);
  const [tab, setTab] = useState(0);

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
          };
        });
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events: ", error);
      }
    };
    fetchEvents();
  }, []);


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
              sx={{ marginTop: "3rem" }}>
                <Tab label="All Events" />
                <Tab label="RSVP'd" />
                <Tab label="Saved" />
                <Tab label="Past Events" />
              </Tabs>
                <div style = {{ display: "flex", justifyContent: "space-between",  marginTop: ".5rem", marginBottom: "-1rem", padding: "0 1 rem" }}>
                  <h2>
                    {eventsData[Object.keys(eventsData)[tab]]}
                  </h2>
                  <SearchBar />
                </div>
            <SortDropdown />
          </div>
          <div className="flex flex-col space-y-6" style={{ marginBottom: ".5rem"}}>
            {events.map((event) => (
                <div key={event.id} style={{ marginBottom: "0.5rem" }}>
                  <EventCard 
                    id={event.id}
                    title={event.title}
                    description={event.description}
                    location={event.location}
                    image={event.imageUrl}
                    startDate={event.startDate}
                    endDate={event.endDate}
                  />
                </div>
            ))}
          </div>
      </div>
    </>
  );
};

export default Events;
