import Location from "../models/locationModel.js";
import nodemailer from "nodemailer";

export const checkTouristActivity = async () => {
  const THRESHOLD = 50 * 60 * 1000; // 50 minutes
  const now = Date.now();

  const inactiveTourists = await Location.find({
    lastUpdated: { $lt: new Date(now - THRESHOLD) }
  });

  if (inactiveTourists.length > 0) {
    for (const tourist of inactiveTourists) {
      await sendAlertMail(tourist.touristId);
    }
  }
};

const sendAlertMail = async (touristId) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ALERT_EMAIL,
      pass: process.env.ALERT_PASS
    }
  });

  await transporter.sendMail({
    from: `"Tourist Safety" <${process.env.ALERT_EMAIL}>`,
    to: process.env.POLICE_EMAIL, // authority email
    subject: "🚨 Tourist Tracking Alert",
    text: `Tourist with ID ${touristId} has not updated location in threshold time.`
  });
};
