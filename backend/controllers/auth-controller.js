import { User } from "../model/user.js";
import { Event } from "../model/event.js";  // Assuming Event model exists
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import mongoose from "mongoose";
import { genereVerificationToken } from '../utils/genereVerificationToken.js';
import { genereateJWTToken } from '../utils/gererateJWTToken.js';
import { sendVerificationEmail, sendWelcomeEmail, sendResetPasswordResetEmail, sendResetSuccessfulEmail } from "../resend/email.js";

// Signup controller
export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = genereVerificationToken();
        const user = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken: verificationToken,
            verficationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });
        await user.save();
        genereateJWTToken(res, user._id);
        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: { ...user._doc, password: undefined }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Login controller
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const isVerified = user.isVerified;
        if (!isVerified) {
            return res.status(400).json({ success: false, message: "Email not verified" });
        }
        genereateJWTToken(res, user._id);
        res.status(200).json({
            success: true,
            message: "Login successful",
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Logout controller
export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Verify email controller
export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verficationTokenExpiresAt: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired code" });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verficationTokenExpiresAt = undefined;
        await user.save();
        await sendWelcomeEmail(user.email, user.name);
        res.status(200).json({ success: true, message: "Email verification success" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Forgot password controller
export const forgotpassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        const resetPasswordToken = crypto.randomBytes(32).toString("hex");
        const resetPasswordExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpiresAt = resetPasswordExpiresAt;
        await user.save();
        await sendResetPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`);


        res.status(200).json({ success: true, message: "Password reset email sent successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Reset password controller
export const resetpassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();
        await sendResetSuccessfulEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset success" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
export const checkAuth = async(req,res) => {
    try {

const user = await User.findById(req.userId);
        if(!user){
            return res.status(401).json({success: false,message: "User not found"});
        }
        res.status(200).json({success: true, user : {...user._doc,password: undefined}});
        
    } catch (error) {
        console.log("error checking auth",error);
        res.status(500).json({success: false, message: error.message});
    }
};
// Event creation for organizers
export const createEvent = async (req, res) => {
    const { eventName, description, date, time, venue, maxAttendees } = req.body;
    try {
        if (!eventName || !description || !date || !time || !venue || !maxAttendees) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const event = new Event({
            eventName,
            description,
            date,
            time,
            venue,
            maxAttendees,
            organizer: req.userId, // Assuming userId is available in req.userId after authentication
        });

        await event.save();
        res.status(201).json({ success: true, message: "Event created successfully", event });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get events for the organizer's dashboard
export const getEvents = async (req, res) => {
    try {
        const events = await Event.find({ organizer: req.userId });
        res.status(200).json({ success: true, events });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    const { id } = req.params; // Get event ID from URL params

    // Validate if the eventId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid event ID format" });
    }

    try {
        // Find the event by ID
        const event = await Event.findById(id);

        // If event not found
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        // Check if the logged-in user is the organizer (use req.userId from verifyToken)
        if (event.organizer.toString() !== req.userId.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this event" });
        }

        // Delete the event
        await event.deleteOne(); // Or use Event.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
        // Catching any error during the process
        console.error(error); // Log the error for debugging
        return res.status(500).json({ success: false, message: error.message });
    }
};

// RSVP to an event
export const rsvpEvent = async (req, res) => {
    const { eventId } = req.body;
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(400).json({ success: false, message: "Event not found" });
        }

        if (event.attendees.includes(req.userId)) {
            return res.status(400).json({ success: false, message: "You have already RSVP'd to this event" });
        }

        // Add user to the event's attendees list
        event.attendees.push(req.userId);
        event.rsvpCount++;
        await event.save();

        res.status(200).json({ success: true, message: "RSVP'd successfully", event });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get events for the participant's dashboard
export const getParticipantsEvents = async (req, res) => {
    try {
        const events = await Event.find({ attendees: req.userId });
        res.status(200).json({ success: true, events });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all upcoming events
export const getUpcomingEvents  = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.status(200).json({ success: true, events });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
//get event details
export const getEventDetails = async (req, res) => {
    try {
      const { id } = req.params;
      const event = await Event.findById(id); // Assuming `Event` is your model
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(200).json({ event });
    } catch (error) {
      console.error("Error fetching event details:", error);
      res.status(500).json({ message: "Failed to fetch event details" });
    }
  };
  