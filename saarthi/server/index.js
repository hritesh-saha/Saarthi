import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import kycRoutes from './routes/kycRoutes.js';
import cron from "node-cron";
import { checkTouristActivity } from "./utils/alertService.js";

import connectDB from './configs/db.js';

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// cron.schedule("*/1 * * * *", () => {
//   console.log("🔍 Checking inactive tourists...");
//   checkTouristActivity();
// });

app.use("/api/kyc", kycRoutes);

app.get('/', (req, res) => {
  res.send('API is working!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
