import mongoose from "mongoose";
import colors from "colors";

// A diferencia de la funcion original, esta puede aceptar 3 inputs a la hora de mandar el mensaje del error
// la primera es un mensaje simple que puede ser sobre-escrito
// la segunda es un input requerido para poder devolver el json de la api al mensaje
// la tercera es el codigo de error por defecto esta 404 pero puede escribir 200 entre otros
function handleNotFoundError(
  message = "Algo salió mal, como papel de aluminio en microondas.",
  res,
  statusCode = 404
) {
  console.warn(colors.yellow(`⚠️  Error manejado: ${statusCode} - ${message}`)); // Logueamos el error manejado
  return res.status(statusCode).json({
    msg: message,
  });
}

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
const uniqueId = () =>
  Date.now().toString(32) + Math.random().toString(32).substring(2);

export {
  isValidObjectId,
  serviceExists,
  handleNotFoundError,
  uniqueId,
  validateMailtrapConfig,
};
