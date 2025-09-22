import express from "express";
import { registerUser, loginUser, getUsers, getUserById, updateUser, deleteUser } from "../Controllers/userController.js";

const router = express.Router();

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
