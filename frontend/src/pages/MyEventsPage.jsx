import React, { useEffect, useState } from "react";
import axios from "axios";
import {Card} from "../components/ui/card";

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await axios.get("/api/auth/participant-events", { withCredentials: true });
        setEvents(res.data.events);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Events</h1>
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
        <p>You haven't RSVP'd to any events yet.</p>
      )}
    </div>
  );
};

export default MyEventsPage;
