import React from "react";
import Navbar from "../components/NavBar";
import EventCard from "../components/EventCard";
import SearchBar from "../components/SearchBar";

const Events = () => {
  const dummyEvents = [
    {
      title: "Event 1",
      date: "05/06/2025",
      description:
        "Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story. What if i make this longer to test how it looks on the card. ",
    },
    {
      title: "Event 1",
      date: "05/06/2025",
      description:
        "Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
    },
    {
      title: "Event 1",
      date: "05/06/2025",
      description:
        "Body text for whatever you’d like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <SearchBar />
          <h2 className="text-xl font-semibold text-right">Upcoming Events</h2>
        </div>

        <div className="flex flex-col space-y-6">
          {dummyEvents.map((event, index) => (
            <div key={index} style={{ marginBottom: "0.5rem" }}>
              <EventCard
                title={event.title}
                date={event.date}
                description={event.description}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Events;
