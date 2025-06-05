import mongoose from "mongoose";
import { uniqueId } from "../helpers/errorHandling.js"; // Asegúrate que la ruta sea correcta si mueves/renombras helpers

// Esquema para el Usuario
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [
        true,
        "El nombre es requerido, los anónimos no son permitidos",
      ],
      trim: true,
    },
    password: {
      type: String,
      required: [
        true,
        "La contraseña es tu llave secreta, no la olvides pero muy seguramente la vas a olvidar",
      ],
      trim: true, // Aunque bcrypt maneja espacios... es un poco redundante
    },
    email: {
      type: String,
      required: [true, "El email es necesario!"],
      trim: true,
      unique: true, // ¡Un email por persona, como el DNI!
      lowercase: true, // Guardamos en minúsculas para evitar duplicados
      match: [
        /.+\@.+\..+/,
        "Por favor, introduce un email válido, ¡no nos engañas!",
      ], // Validación básica de formato
    },
    token: {
      type: String,
      default: () => uniqueId(), // Genera un token único al crear para validar al usuario y luego sera borrado
    },
    deleteToken: { type: String },
    passwordResetToken: { type: String },
    deleteTokenExpires: { type: Date },
    passwordResetTokenExpires: { type: Date },
    verified: {
      type: Boolean,
      default: false, // Empieza sin verificar.
    },
    admin: {
      type: Boolean,
      default: false, // Por defecto, no eres admin.
    },
  },
  { timestamps: true }
); // timestamps añade createdAt y updatedAt automáticamente, ¡útil para rastrear!

const User = mongoose.model("User", userSchema);

export default User;
