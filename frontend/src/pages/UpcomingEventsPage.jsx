import React, { useEffect, useState } from "react";
import axios from "axios";
import {Card} from "../components/ui/card";

const UpcomingEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/api/auth/upcoming-events", { withCredentials: true });
        setEvents(res.data.events);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      {events.length ? (
        events.map((event) => (
          <Card key={event._id}>
            <h2 className="text-xl font-bold">{event.eventName}</h2>
            <p>{event.description}</p>
            <p>
              {event.date} at {event.time}
            </p>
            <p>Venue: {event.venue}</p>
          </Card>
        ))
      ) : (
        <p>No upcoming events available.</p>
      )}
    </div>
  );
};

export default UpcomingEventsPage;
