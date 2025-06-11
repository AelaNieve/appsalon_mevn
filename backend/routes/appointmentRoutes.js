import express from 'express';
import { createAppointment, getAppointmentsByDate } from '../controllers/appointmentControllers.js';
import authMiddleware from '../middleware/authMIddleware.js';


const router = express.Router();

router.route("/")
    .post(authMiddleware, createAppointment)
    .get(authMiddleware, getAppointmentsByDate);



export default router;