import { motion } from "framer-motion";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuthStore } from "@/store/authStore";
import { apiGet, apiDelete } from "@/lib/utils";

const DashboardPage = () => {
  const { user, isCheckingAuth } = useAuthStore();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCardView, setIsCardView] = useState(true); // State to toggle between card and table view
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiGet("http://localhost:3000/api/auth/events");
        console.log(response); // Check the structure of the response
        setEvents(response?.events || []); // Set events from response.events
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEvents([]); // Set to empty array in case of error
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    try {
      await apiDelete(`http://localhost:3000/api/auth/events/${eventId}`);
      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  if (isCheckingAuth || loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
        }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          User not found. Please log in.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => (window.location.href = "/login")}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f0f0",
        padding: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          maxWidth: "800px",
          width: "100%",
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          Welcome, <strong>{user.name}</strong>!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => (window.location.href = "/create")}
        >
          Create New Event
        </Button>

        {/* Button to navigate to all events page */}
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate("/upcoming-events")}
        >
          View All Events
        </Button>

        {/* Toggle between card and table view */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            variant={isCardView ? "contained" : "outlined"}
            onClick={() => setIsCardView(true)}
            sx={{ mr: 2 }}
          >
            Card View
          </Button>
          <Button
            variant={isCardView ? "outlined" : "contained"}
            onClick={() => setIsCardView(false)}
          >
            Table View
          </Button>
        </Box>

        {/* Events Rendering */}
        <Box mt={4}>
          <Typography variant="h5" component="h2" gutterBottom>
            Your Events
          </Typography>

          {Array.isArray(events) && events.length === 0 ? (
            <Typography variant="body1" align="center">
              No events found.
            </Typography>
          ) : (
            <>
              {isCardView ? (
                // Render events as cards
                events.map((event) => (
                  <Card key={event._id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{event.eventName}</Typography>
                      <Typography variant="body2">
                        Date: {new Date(event.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">Time: {event.time}</Typography>
                      <Typography variant="body2">{event.description}</Typography>
                      <Box mt={2}>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => navigate(`/events/${event._id}`)} // Redirect to event details page
                          sx={{ mr: 2 }}
                        >
                          View
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(event._id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))
              ) : (
                // Render events in a table
                <Box sx={{ width: "100%", overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ padding: "10px", border: "1px solid #ccc" }}>Event Name</th>
                        <th style={{ padding: "10px", border: "1px solid #ccc" }}>Date</th>
                        <th style={{ padding: "10px", border: "1px solid #ccc" }}>Time</th>
                        <th style={{ padding: "10px", border: "1px solid #ccc" }}>Description</th>
                        <th style={{ padding: "10px", border: "1px solid #ccc" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event) => (
                        <tr key={event._id}>
                          <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                            {event.eventName}
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                            {new Date(event.date).toLocaleDateString()}
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                            {event.time}
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                            {event.description}
                          </td>
                          <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => navigate(`/events/${event._id}`)} // Redirect to event details page
                              sx={{ mr: 2 }}
                            >
                              View
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleDelete(event._id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              )}
            </>
          )}
        </Box>
      </motion.div>
    </Box>
  );
};

export default DashboardPage;
