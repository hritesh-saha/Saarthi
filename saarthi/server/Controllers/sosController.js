import SOS from "../models/sosModel.js";
import { sendMail } from "../utils/sendMail.js";
import User from "../models/userModel.js";  // to fetch username

// Mock police station emails by area
const policeStations = {
  "Kolkata": "kolkata.police@gov.in",
  "Delhi": "delhi.police@gov.in",
  "Mumbai": "mumbai.police@gov.in"
};

// Create or update SOS alert
// export const createSOS = async (req, res) => {
//   try {
//     const { userId, username, location, city } = req.body;

//     // Get police station email from city
//     const policeStationEmail = policeStations[city] || "default.police@gov.in";
//     const name=username || "hritesh";

//     // Upsert: find existing SOS record and update, or create new if none exists
//     const sos = await SOS.findOneAndUpdate(
//       {}, // singleton: no filter
//       { userId, username: name, location, policeStationEmail, timestamp: new Date() },
//       { upsert: true, new: true, setDefaultsOnInsert: true }
//     );

//     // Fetch user info (for email template)
//     const user = await User.findById(userId).select("username email");

//     // Prepare details for email
//     const details = {
//       username: user ? user.username : "Anonymous User",
//       location,
//       city,
//       timestamp: new Date().toLocaleString(),
//     };
    
//     // Send mail to police
//     // await sendMail(
//     //   policeStationEmail,
//     //   "🚨 Emergency SOS Alert",
//     //   details
//     // );
//     console.log(`Mock email sent to police station with details:`, details);

//     // Respond with success
//     res.status(201).json({ message: "✅ SOS sent successfully", sos });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
export const createSOS = async (req, res) => {
  try {
    const { userId, username, location, city } = req.body;

    const policeStationEmail = policeStations[city] || "default.police@gov.in";
    const name = username || "hritesh";

    // Check if an SOS for this user already exists
    let sos = await SOS.findOne({ userId });

    if (sos) {
      // Increment alert count if SOS already exists
      sos.alertCount += 1;
      sos.location = location;
      sos.policeStationEmail = policeStationEmail;
      sos.status = "Pending";
      sos.createdAt = new Date();
      await sos.save();
    } else {
      // Create new SOS with alertCount = 1
      sos = new SOS({
        userId,
        username: name,
        location,
        policeStationEmail,
        alertCount: 1
      });
      await sos.save();
    }

    // Fetch user info (for email template)
    const user = await User.findById(userId).select("username email");

    const details = {
      username: user ? user.username : "Anonymous User",
      location,
      city,
      timestamp: new Date().toLocaleString(),
      alertCount: sos.alertCount
    };

    // Send mail to police
    await sendMail(
      policeStationEmail,
      "🚨 Emergency SOS Alert",
      details
    );

    console.log(`Mock email sent to police station with details:`, details);

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
