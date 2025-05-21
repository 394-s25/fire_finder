import React, { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import EventCard from "../components/EventCard";
import SearchBar from "../components/SearchBar";
import placeholderImg from "../imgs/placeholder.jpeg";
import TradeExpo from "../imgs/TradeExpo.jpeg";
import CareerFair from "../imgs/CareerFair.jpg";
import SortDropdown from "../components/Eventsdropdown";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firestoreConfig";

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "events"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
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
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div
          className="flex items-center justify-between mb-4"
          style={{ marginBottom: "0.5rem", marginTop: "4.5rem" }}
        >
          <SearchBar />
          <h2
            className="text-xl font-semibold"
            style={{
              color: "black",
              position: "absolute",
              left: "190px",
              top: "90px",
              marginBotton: "100px",
            }}
          >
            Upcoming Events
          </h2>
        </div>
        <SortDropdown />

        <div
          className="flex flex-col space-y-6"
          style={{ marginBottom: "0.5rem", marginTop: "8.5rem" }}
        >
          {events.map((event) => (
            <div key={event.id} style={{ marginBottom: "0.5rem" }}>
              <EventCard
                title={event.title}
                date={event.date}
                description={event.description}
                image={event.imageUrl}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Events;
