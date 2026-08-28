import mongoose from "mongoose";

const IncidentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    image: {
        type: String, // Storing base64 encoded string
        required: false
    },
    mobileNumber: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Incident = mongoose.model("Incident", IncidentSchema);
