import mongoose from "mongoose";
import colors from "colors";
import crypto from "crypto";

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

// Generador de IDs únicos
const uniqueId = () => crypto.randomBytes(15).toString("hex");

export { isValidObjectId, serviceExists, uniqueId, validateMailtrapConfig };
