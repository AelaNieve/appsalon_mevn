// backend\routes\authRoutes.js
import express from "express";
import { createAppointment } from "../controllers/appointmentController.js";
import authMiddleware from "../middleware/authMIddleware.js";

const router = express.Router();

router.route("/").post(authMiddleware, createAppointment);

export default router;
