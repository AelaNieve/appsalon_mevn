// backend\routes\authRoutes.js
import express from "express";
import {
  register,
  verifyAccount,
  login,
  requestAccountDeletion,
  confirmAccountDeletion,
  forgotPassword,
  resetPassword,
} from "../controllers/authControllers.js";

const router = express.Router();

// Rutas para la autenticación
router.post("/register", register);

// Para confirmar que no eres un robot... de spam
router.get("/verify/:token", verifyAccount);

// POST api/auth/login
router.post("/login", login);

// Route to request account deletion (sends email with confirmation link)
router.post("/request-delete-account", requestAccountDeletion);

// Route to confirm and execute account deletion using token from email
router.delete("/confirm-delete-account/:deleteToken", confirmAccountDeletion);

// Ruta para solicitar el envío del correo de recuperación de contraseña
router.post("/forgot-password", forgotPassword);

// Ruta para procesar el cambio de contraseña con el token
router.post("/reset-password/:passwordResetToken", resetPassword); // NEW

export default router;
