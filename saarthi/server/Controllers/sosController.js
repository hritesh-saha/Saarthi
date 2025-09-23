import SOS from "../models/sosModel.js";
import { sendMail } from "../utils/sendMail.js";
import User from "../models/userModel.js";  // to fetch username

// Mock police station emails by area
const policeStations = {
  "Kolkata": "kolkata.police@gov.in",
  "Delhi": "delhi.police@gov.in",
  "Mumbai": "mumbai.police@gov.in"
};

// Create SOS alert
export const createSOS = async (req, res) => {
  try {
    const { userId, location, city } = req.body;

    // Get police station email from city
    const policeStationEmail = policeStations[city] || "default.police@gov.in";

    // Save SOS in DB
    const sos = new SOS({ userId, location, policeStationEmail });
    await sos.save();

    // Fetch user info (for email template)
    const user = await User.findById(userId).select("username email");

    // Prepare details for email
    const details = {
      username: user ? user.username : "Anonymous User",
      location,
      city,
      timestamp: new Date().toLocaleString(),
    };

    // Send mail to police
    await sendMail(
      policeStationEmail,
      "🚨 Emergency SOS Alert",
      details
    );

    // Respond with success
    res.status(201).json({ message: "✅ SOS sent successfully", sos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all SOS alerts (for dashboard notifications)
export const getSOSAlerts = async (req, res) => {
  try {
    const alerts = await SOS.find().populate("userId", "username email");
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
