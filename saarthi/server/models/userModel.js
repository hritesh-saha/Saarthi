import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // unique username
  email: { type: String, required: true, unique: true }, // unique email
  password: { type: String, required: true }, // hashed password
  role: { 
    type: String, 
    enum: ["tourist", "admin", "officer"], 
    default: "tourist" 
  }, // roles for access control
  kycId: { type: mongoose.Schema.Types.ObjectId, ref: "KYC" }, // Reference to KYC record
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
