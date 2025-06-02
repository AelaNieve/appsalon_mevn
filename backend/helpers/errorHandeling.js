import mongoose from "mongoose";

// A diferencia de la funcion original, esta puede hacertar 3 inputs a la hora de mandar el mensaje del error
// la primera es un mensaje simple que puede ser sobre-escrito
// la segunda es un input requerido para poder devolver el json de la api al mensaje
// la tercera es el codigo de error por defecto esta 404 pero puede escribir 200 entre otros
function handleNotFoundError(
  message = "Algo salio mal",
  res,
  statusCode = 404
) {
  console.log(message);
  return res.status(statusCode).json({
    msg: message,
  });
}

// Esta primero importara la función necesaria de mongoose y luego devolvera un boleano en función si es valida o no
function validateObjectId(id) {
  const isValidID = mongoose.Types.ObjectId.isValid;
  if (!isValidID(id)) {
    return true;
  }
  return false;
}

// Esta función valida que la linea de codigo anterior "const service = await servicesModels.findById(id);"
// Haya devuelto un numero y no este null como normalmente devuelve si el id no existe
function validateServiceId(service) {
  if (service == null) {
    return true;
  }
  return false;
}

const uniqueId = () =>
  Date.now().toString(32) + Math.random().toString(32).substring(2);

export { validateObjectId, validateServiceId, handleNotFoundError, uniqueId };
