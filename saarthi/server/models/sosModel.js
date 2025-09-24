import mongoose from "mongoose";

const sosSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: {
    type: String,
  },
  location: {
    latitude: { type: String, required: true },
    longitude: { type: String, required: true }
  },
  policeStationEmail: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" },
  alertCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const sos= mongoose.model("SOS", sosSchema);

export default sos;
