import mongoose from "mongoose";
import colors from "colors";
import crypto from "crypto";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Devuelve TRUE si el ID es VÁLIDO, FALSE si es INVÁLIDO.
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Devuelve TRUE si el servicio EXISTE (no es null), FALSE si NO EXISTE.
function serviceExists(service) {
  return service != null; // O simplemente !!service
}

// Helper function to validate Mailtrap environment variables
function validateMailtrapConfig() {
  const mailtrapHost = process.env.MAILTRAP_HOST;
  const mailtrapPort = parseInt(process.env.MAILTRAP_PORT, 10);
  const mailtrapUser = process.env.MAILTRAP_USER;
  const mailtrapPass = process.env.MAILTRAP_PASS;

  if (!mailtrapHost || !mailtrapPort || !mailtrapUser || !mailtrapPass) {
    console.error(
      colors.red.bold(
        "☠️  Error: Faltan variables de entorno para la configuración de Mailtrap. El correo no se enviará."
      )
    );
    throw new Error("Mailtrap configuration missing.");
  }

  return { mailtrapHost, mailtrapPort, mailtrapUser, mailtrapPass };
}

// Generador de IDs únicos (más seguro)
const uniqueId = () => crypto.randomBytes(15).toString("hex");

// Alternativa: Generador de IDs únicos basado en fecha y aleatorio
// const uniqueId = () => Date.now().toString(32) + Math.random().toString(32).substring(2);

// Valida ObjectId y responde con 400 si no es válido
function validateObjectId(id, res) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("El ID no es válido");
    return res.status(400).json({
      msg: error.message,
    });
  }
}

// Formatea fecha en español
function formatDate(date) {
  return format(date, "PPPP", { locale: es });
}

export {
  isValidObjectId,
  serviceExists,
  uniqueId,
  validateMailtrapConfig,
  validateObjectId,
  formatDate,
};
