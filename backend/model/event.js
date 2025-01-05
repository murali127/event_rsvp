import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,  // Store time in format like 'HH:MM AM/PM'
        required: true,
    },
    venue: {
        type: String,
        required: true,
    },
    maxAttendees: {
        type: Number,
        required: true,
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Reference to the User model
        required: true,
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Array of user IDs (users who RSVP'd)
    }],
    rsvpCount: {
        type: Number,
        default: 0,  // Initialize RSVP count to 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Event = mongoose.model("Event", eventSchema);
