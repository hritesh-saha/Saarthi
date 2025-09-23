import express from "express";
import { createSOS, getSOSAlerts } from "../Controllers/sosController.js";

const router = express.Router();

// Route to create or update an SOS alert (user clicks SOS button)
router.post("/sos", createSOS);

// Route to fetch all SOS alerts (for dashboard notifications)
router.get("/sos", getSOSAlerts);

export default router;
