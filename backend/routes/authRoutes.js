import express from "express";
import {
  register,
  verifyAccount,
  login,
} from "../controllers/authControllers.js";

const router = express.Router();

// Rutas para la autenticación
// POST api/auth/register
router.post("/register", register);

// GET api/auth/verify/:token - Para confirmar que no eres un robot... de spam
router.get("/verify/:token", verifyAccount);

// POST api/auth/login
router.post("/login", login);

export default router;
