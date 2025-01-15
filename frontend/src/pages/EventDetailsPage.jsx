import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";

const EventDetailsPage = () => {
  const { id } = useParams();  // Get event ID from the URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRSVPed, setIsRSVPed] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching event details for ID:", id);  // Log event ID being fetched
        const res = await axios.get(`http://localhost:3000/api/auth/events/${id}`, { withCredentials: true });
        console.log("Event details response:", res.data);  // Log the response from the server
        
        if (res.data && res.data.event) {
          setEvent(res.data.event);
          setIsRSVPed(res.data.event.attendees.includes(res.data.userId));  // Assuming API returns the current user's ID
          console.log("Event data set:", res.data.event);  // Log the event data set in state
        } else {
          console.error("Event not found in response:", res.data);
          setError("Event not found");
        }
      } catch (err) {
        console.error("Error fetching event details:", err);  // Log any error
        setError(err.response?.data?.message || "Failed to fetch event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleRSVP = async () => {
    try {
      console.log("RSVPing to event...");
      const res = await axios.post("http://localhost:3000/api/auth/rsvp", { eventId: id }, { withCredentials: true });
      console.log("RSVP response:", res.data);
      alert("RSVP successful!");
      setIsRSVPed(true);
    } catch (err) {
      console.error("Error during RSVP:", err);
      alert(err.response?.data?.message || "RSVP failed.");
    }
  };
  

  if (loading) return <div className="p-4">Loading event details...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      {event ? (
        <>
          <h1 className="text-3xl font-bold mb-4">{event.eventName}</h1>
          <p className="mb-2">{event.description}</p>
          <p className="mb-2">
            {new Date(event.date).toLocaleDateString()} at {event.time}
          </p>
          <p className="mb-4">Venue: {event.venue}</p>
          <p className="mb-4">Max Attendees: {event.maxAttendees}</p>
          <p className="mb-4">Current RSVPs: {event.attendees.length}</p>

          {isRSVPed ? (
            <p className="text-green-500">You have already RSVP'd to this event.</p>
          ) : (
            <Button onClick={handleRSVP}>RSVP</Button>
          )}
        </>
      ) : (
        <p>Event not found.</p>
      )}
    </div>
  );
};

export default EventDetailsPage;
