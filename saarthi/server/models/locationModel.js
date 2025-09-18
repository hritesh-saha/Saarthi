import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  touristId: { type: mongoose.Schema.Types.ObjectId, ref: "KYC", required: true },
  lastCoordinates: {
    latitude: String,
    longitude: String
  },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model("Location", locationSchema);
