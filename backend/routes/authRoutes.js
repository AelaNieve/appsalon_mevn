import express from "express";
import {
  register,
  verifyAccount,
  login,
  handleDeleteAccountRequest, // Import the new controller function
} from "../controllers/authControllers.js";

const router = express.Router();

// Rutas para la autenticación
// POST api/auth/register
router.post("/register", register);

// GET api/auth/verify/:token - Para confirmar que no eres un robot... de spam
router.get("/verify/:token", verifyAccount);

// POST api/auth/login
router.post("/login", login);

// POST api/auth/delete-account - Route to request account deletion
router.post("/delete-account", handleDeleteAccountRequest);

export default router;
