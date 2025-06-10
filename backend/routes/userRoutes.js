import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getUserAppointments } from '../controllers/userController.js';

const router = express.Router();

// Ruta para obtener las citas del usuario autenticado
router.get('/appointments', authMiddleware, getUserAppointments);

export default router;