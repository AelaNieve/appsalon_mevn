import express from "express";
import {
  register,
  verifyAccount,
  login,
  // Assuming you rename controllers as suggested:
  requestAccountDeletion, // Formerly verifyDelete
  confirmAccountDeletion, // Formerly deleteAccount
} from "../controllers/authControllers.js";

const router = express.Router();

// Rutas para la autenticación
// POST api/auth/register
router.post("/register", register);

// GET api/auth/verify/:token - Para confirmar que no eres un robot... de spam
router.get("/verify/:token", verifyAccount);

// POST api/auth/login
router.post("/login", login);

// Route to request account deletion (sends email with confirmation link)
router.post("/request-delete-account", requestAccountDeletion); // Changed from deleteAccount

// Route to confirm and execute account deletion using token from email
router.get("/confirm-delete-account/:deleteToken", confirmAccountDeletion); // Changed from verifyDelete and added /:deleteToken

export default router;
