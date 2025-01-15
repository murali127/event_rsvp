import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/button"; // Adjust this import as needed

const AllEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        // Make sure to use the correct backend URL
        const res = await axios.get("http://localhost:3000/api/auth/upcoming-events", { withCredentials: true });
        console.log("Response from server:", res.data);  // Log response to debug

        // Ensure events is always an array
        if (res.data.events) {
          setEvents(Array.isArray(res.data.events) ? res.data.events : []);
        } else {
          setError("No events found.");
        }
      } catch (err) {
        console.log("Error fetching events:", err); // Log error for debugging
        setError(err.response?.data?.message || "Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleRSVP = async (eventId) => {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/rsvp", { eventId }, { withCredentials: true });
      alert("RSVP successful!");
      // Optionally update the event data (e.g., add user to attendees list)
    } catch (err) {
      alert(err.response?.data?.message || "RSVP failed.");
    }
  };

  if (loading) return <div className="p-4">Loading events...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Upcoming Events</h1>
      {events.length === 0 ? (
        <p>No upcoming events at the moment.</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event._id} className="border p-4 rounded-md shadow-lg">
              <h2 className="text-xl font-bold">{event.eventName}</h2>
              <p>{event.description}</p>
              <p>{new Date(event.date).toLocaleDateString()} at {event.time}</p>
              <p>Venue: {event.venue}</p>
              <p>Max Attendees: {event.maxAttendees}</p>
              <p>RSVP Count: {event.rsvpCount}</p>
              <Button
                onClick={() => handleRSVP(event._id)}
                disabled={event.rsvpCount >= event.maxAttendees}
              >
                RSVP
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllEventsPage;
