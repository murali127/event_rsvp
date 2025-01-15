import React, { useState } from "react";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";  // Corrected import for named export

const CreateEventPage = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    maxAttendees: "",
  });

  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For error state
  const [success, setSuccess] = useState(null); // For success message

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous error
    setSuccess(null); // Clear previous success message

    try {
      const response = await axios.post("http://localhost:3000/api/auth/create", formData, { withCredentials: true });
      if (response.status === 200) {
        setSuccess("Event created successfully!");
        setFormData({
          eventName: "",
          description: "",
          date: "",
          time: "",
          venue: "",
          maxAttendees: "",
        });
      }
    } catch (error) {
      setError("Error creating event. Please try again.");
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after request is done
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>
      {error && <div className="text-red-500">{error}</div>} {/* Error message */}
      {success && <div className="text-green-500">{success}</div>} {/* Success message */}
      <form onSubmit={handleSubmit}>
        <Input
          name="eventName"
          placeholder="Event Name"
          value={formData.eventName}
          onChange={handleChange}
        />
        <Input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <Input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
        />
        <Input
          name="time"
          type="time"
          value={formData.time}
          onChange={handleChange}
        />
        <Input
          name="venue"
          placeholder="Venue"
          value={formData.venue}
          onChange={handleChange}
        />
        <Input
          name="maxAttendees"
          type="number"
          placeholder="Max Attendees"
          value={formData.maxAttendees}
          onChange={handleChange}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </Button>
      </form>
    </div>
  );
};

export default CreateEventPage;
