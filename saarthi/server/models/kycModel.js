import mongoose from "mongoose";

const kycSchema = new mongoose.Schema({
  touristId: { type: String, required: true, unique: true }, // Unique ID for the tourist
  fullName: { type: String, required: true },
  passportNumber: { type: String, required: true },
  nationality: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  geoLocation: {
    latitude: { type: String },
    longitude: { type: String }
  },
  documentUrl: { type: String, required: true }, // Cloudinary URL
  blockchainId: { type: String, required: true }, // Unique ID returned from blockchain
  encryptedData: { type: String, required: true }, // AES encrypted blob
}, { timestamps: true });

const kyc=mongoose.model("KYC", kycSchema);

export default kyc;
