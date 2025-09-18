import express from "express";
import { upload } from "../utils/cloudinary.js";
import { storeKYC } from "../Controllers/kycController.js";

const router = express.Router();

router.post("/store-kyc", upload.single("document"), storeKYC);

export default router;
