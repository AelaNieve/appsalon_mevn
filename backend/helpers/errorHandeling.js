import mongoose from "mongoose";
import colors from "colors";

// A diferencia de la funcion original, esta puede aceptar 3 inputs a la hora de mandar el mensaje del error
// la primera es un mensaje simple que puede ser sobre-escrito
// la segunda es un input requerido para poder devolver el json de la api al mensaje
// la tercera es el codigo de error por defecto esta 404 pero puede escribir 200 entre otros
function handleNotFoundError(
  message = "Algo salió mal, como calcetín en microondas.", // Mensaje por defecto con chispa
  res,
  statusCode = 404
) {
  console.warn(colors.yellow(`⚠️  Error manejado: ${statusCode} - ${message}`)); // Logueamos el error manejado
  return res.status(statusCode).json({
    msg: message,
  });
}

// Esta primero importara la función necesaria de mongoose y luego devolvera un boleano en función si es valida o no
// ¡Ojo aquí! Esta función devuelve `true` si el ID NO ES VÁLIDO. Un poco contraintuitivo, ¿no?
// Podríamos llamarla `isInvalidObjectId` para que sea más claro, o invertir la lógica.
// Por ahora, mantendremos su comportamiento original pero con un comentario más explícito.
// Devuelve TRUE si el ID es INVÁLIDO, FALSE si es VÁLIDO. ¡Al revés de lo que uno esperaría!
function validateObjectId(id) {
  // const isValidID = mongoose.Types.ObjectId.isValid; // No es necesario crear una variable para esto
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return true; // ID NO es válido
  }
  return false; // ID SÍ es válido
}
// Alternativa más clara (si decides cambiarla y ajustar su uso en los controladores):
/*
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id); // Devuelve TRUE si es VÁLIDO, FALSE si es INVÁLIDO
}
*/

// Esta función valida que la linea de codigo anterior "const service = await servicesModels.findById(id);"
// Haya devuelto un numero y no este null como normally devuelve si el id no existe
// Revisa si el servicio es un fantasma (null). Devuelve TRUE si NO se encontró el servicio (es null).
function validateServiceId(service) {
  if (service == null) {
    // O simplemente !service
    return true; // Servicio NO encontrado
  }
  return false; // Servicio SÍ encontrado
}
// Alternativa más clara (si decides cambiarla y ajustar su uso):
/*
function serviceExists(service) {
  return service != null; // Devuelve TRUE si existe, FALSE si no.
}
*/

// Generador de IDs únicos, ¡más original que nombre de banda indie!
// Ojo: Para tokens de verificación está bien, pero no para cosas criptográficamente seguras a largo plazo.
const uniqueId = () =>
  Date.now().toString(32) + Math.random().toString(32).substring(2);

export { validateObjectId, validateServiceId, handleNotFoundError, uniqueId };
