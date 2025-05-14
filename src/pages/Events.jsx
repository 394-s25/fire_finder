import React from "react";
import Navbar from "../components/NavBar";
import EventCard from "../components/EventCard";
import SearchBar from "../components/Searchbar";

const Events = () => {
  const dummyEvents = [
    {
      title: "ETHS Skilled Trade Expo",
      date: "05/05/2025",
      description:
        "This expo is tailored for ETHS students exploring career opportunities. You'll discover skilled trade careers that offer great pay, job security, and the satisfaction of creating something tangible every day. Join The Trade Collective for an interactive showcase featuring hands-on demos, networking with industry professionals, and insights into educational pathways leading to rewarding trade professions.\n 2:30 - 5:00 pm CDT \n 1910 Greenwood St",
    },
    {
      title: "Trade Fair",
      date: "05/15/2025",
      description:
        "Body text for whatever you’d Explore exciting careers in fields like Manufacturing, Plumbing & HVAC, Electrical, Landscaping, Automotive, and Construction Management, where you’ll shape the future through innovation, expertise, and leadership.\n 2:00 pm - 5:00 pm CDT \n Location TBD \n",
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
