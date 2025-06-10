import express from "express";
import { getUserAppointments } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMIddleware.js";

const router = express.Router();

router.get("/appointments", authMiddleware, getUserAppointments);

export default router;
