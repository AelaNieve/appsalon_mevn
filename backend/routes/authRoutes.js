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
  user,
} from "../controllers/authControllers.js";
import authMiddleware from "../middleware/authMIddleware.js";

const router = express.Router();

// Rutas para la autenticación
// Para confirmar que no eres un robot... de spam
// Route to request account deletion (sends email with confirmation link)
// Route to confirm and execute account deletion using token from email
// Ruta para solicitar el envío del correo de recuperación de contraseña
// Ruta para procesar el cambio de contraseña con el token
// POST api/auth/login
router.post("/register", register);
router.get("/verify/:token", verifyAccount);
router.post("/request-delete-account", requestAccountDeletion);
router.delete("/confirm-delete-account/:deleteToken", confirmAccountDeletion);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:passwordResetToken", resetPassword); // NEW
router.post("/login", login);
router.post("/logout", (req, res) => {
  // Clear the cookie named 'AUTH_TOKEN'
  res.clearCookie("AUTH_TOKEN", {
    // These options must match the ones used in the login controller
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Sesión exitosamente cerrada" });
});

// Area con autentificación requiere un JWT
router.get("/user", authMiddleware, user);

export default router;
