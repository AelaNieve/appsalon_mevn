import express from "express";
import {
  createAppointment,
  getAppointmentsByDate,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
} from "../controllers/appointmentControllers.js";
import authMiddleware from "../middleware/authMIddleware.js";

const router = express.Router();

router
  .route("/")
  .post(authMiddleware, createAppointment)
  .get(authMiddleware, getAppointmentsByDate);

router.route('/:id')
  .get(authMiddleware, getAppointmentById)
  .put(authMiddleware, updateAppointment)
  .delete(authMiddleware, deleteAppointment)

export default router;
