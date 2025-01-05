import express from "express";
import {
  logout,
  login,
  signup,
  verifyEmail,
  forgotpassword,
  resetpassword,
  checkAuth,
  createEvent,
  getEvents,
  deleteEvent,
  rsvpEvent, // Add rsvpEvent
  getParticipantsEvents, // Add getParticipantsEvents
  getUpcomingEvents // Add getUpcomingEvents
} from "../controllers/auth-controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Authentication Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotpassword);
router.post("/reset-password/:token", resetpassword);
router.get("/check-auth", verifyToken, checkAuth);

// Event Routes
router.post("/events", verifyToken, createEvent);
router.get("/events", verifyToken, getEvents);
router.delete("/events/:id", verifyToken, deleteEvent);
router.post("/rsvp", verifyToken, rsvpEvent); // RSVP to an event
router.get("/participant-events", verifyToken, getParticipantsEvents); // Get events for participants
router.get("/upcoming-events", verifyToken, getUpcomingEvents); // Get upcoming events

export default router;
