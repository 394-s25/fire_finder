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
              //left: "190px",
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
