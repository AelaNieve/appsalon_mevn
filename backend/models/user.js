import mongoose from "mongoose";
import { uniqueId } from "../helpers/errorHandling.js";

// Esquema para el Usuario
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true],
    trim: true,
  },
  password: {
    type: String,
    required: [true],
    trim: true,
  },
  passwordAttems: {
    type: Number,
    default: 0,
  },
  email: {
    type: String,
    required: [true],
    trim: true,
    unique: true,
    lowercase: true, // Guardamos en minúsculas para evitar duplicados
  },
  token: {
    type: String,
    default: () => uniqueId(), // Genera un token único al crear para validar al usuario y luego sera borrado
  },
  // tokens for deleting an account
  deleteToken: { type: String },
  deleteTokenExpires: { type: Date },
  //tokens for Password Recovery
  passwordResetToken: { type: String },
  passwordResetTokenExpires: { type: Date },
  verified: {
    type: Boolean,
    default: false, // Empieza sin verificar.
  },
  admin: {
    type: Boolean,
    default: false, // Por defecto, no eres admin.
  },
});

const User = mongoose.model("User", userSchema);

export default User;
