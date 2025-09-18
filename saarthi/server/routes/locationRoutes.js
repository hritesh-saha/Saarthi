import express from "express";
import { getLastLocation, updateLocation } from "../Controllers/locationController";

const router = express.Router();

router.post("/update", updateLocation);  // tourist device calls
router.get("/last/:touristId", getLastLocation); // admin/police check

export default router;
