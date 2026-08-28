import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Incident } from "./models/Incident.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const mongoURL = process.env.MONGO_URI || process.env.mongo_url || process.env.MONGO_URL || "mongodb://127.0.0.1:27017/sih-2k26";

const connectdb = async () => {
    try {
        await mongoose.connect(mongoURL);
        console.log("Database connected successfully");
    }
    catch (err) {
        console.error("Database connection failed:", err.message);
    }
}


const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Server is running");
});

// GET: Retrieve all incidents
app.get("/api/incidents", async (req, res) => {
    try {
        const incidents = await Incident.find().sort({ createdAt: -1 });
        res.status(200).json(incidents);
    } catch (err) {
        console.error("Error retrieving incidents:", err);
        res.status(500).json({ error: "Failed to retrieve incidents" });
    }
});

// POST: Create a new incident report
app.post("/api/incidents", async (req, res) => {
    try {
        const { name, latitude, longitude, image, mobileNumber, notes } = req.body;
        if (!name || latitude === undefined || longitude === undefined || !mobileNumber) {
            return res.status(400).json({ error: "Name, latitude, longitude, and mobileNumber are required fields" });
        }
        
        const newIncident = new Incident({
            name,
            latitude: Number(latitude),
            longitude: Number(longitude),
            image,
            mobileNumber,
            notes
        });
        
        await newIncident.save();
        console.log(`[Incident Reported] Name: ${name}, Mobile: ${mobileNumber}`);
        res.status(201).json({ success: true, data: newIncident });
    } catch (err) {
        console.error("Error creating incident:", err);
        res.status(500).json({ error: "Failed to save incident report" });
    }
});

// DELETE: Remove an incident report
app.delete("/api/incidents/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Incident.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ error: "Incident report not found" });
        }
        console.log(`[Incident Deleted] ID: ${id}`);
        res.status(200).json({ success: true, message: "Incident report deleted successfully" });
    } catch (err) {
        console.error("Error deleting incident:", err);
        res.status(500).json({ error: "Failed to delete incident report" });
    }
});

app.listen(PORT, () => {
    connectdb()
    console.log(`Server started on port ${PORT}`);
})