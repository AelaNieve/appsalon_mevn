import colors from "colors";
import servicesModels from "../models/servicesModels.js";
import {
  validateObjectId,
  handleNotFoundError,
} from "../helpers/errorHandeling.js";
import mongoose from "mongoose";

// Aquí revisamos si el ID es de verdad y si el servicio existe.
const findServiceByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return handleNotFoundError(
      "El ID proporcionado no es válido. ¿Estás inventando cosas?",
      res,
      400
    );
  }

  try {
    const service = await servicesModels.findById(id);
    if (!service) {
      return handleNotFoundError(
        `El servicio con ID '${id}' no fue encontrado. ¿Quizas alguien quito este servicio?`,
        res,
        404
      );
    }
    req.service = service;
    next();
  } catch (error) {
    console.error(
      colors.red.bold(
        `☠️  Error buscando servicio por ID (${id}): ${error.message}`
      )
    );
    return res
      .status(500)
      .json({ msg: "Error interno del servidor al buscar el servicio." });
  }
};

const createService = async (req, res) => {
  if (
    Object.values(req.body).some(
      (value) => typeof value === "string" && value.trim() === ""
    ) ||
    Object.keys(req.body).length === 0
  ) {
    const error = new Error(
      "De verdad intentaste mandar un servicio vacio? no jodas"
    );
    return res.status(400).json({
      msg: error.message,
    });
  }
  // Validar que el precio sea un número positivo
  const price = parseFloat(req.body.price);
  if (isNaN(price) || price <= 0) {
    const error = new Error(
      "El precio debe ser un número positivo. A menos que te guste trabajar gratis"
    );
    return res.status(400).json({ msg: error.message });
  }

  try {
    const service = new servicesModels(req.body);
    await service.save();
    res.status(201).json({
      // Es buena práctica devolver el objeto creado y un status 201
      msg: "Servicio creado con el poder de mil soles",
      service,
    });
  } catch (error) {
    console.error(
      colors.red.bold(`☠️  Error al crear servicio: ${error.message}`)
    );
    // Puede ser un error de validación de Mongoose si los tipos no coinciden
    if (error.name === "ValidationError") {
      return res.status(400).json({
        msg: "Datos inválidos para el servicio.",
        details: error.errors,
      });
    }
    res.status(500).json({
      msg: "Error interno del servidor. no quiso .. el servicio.. nacer hoy.",
    });
  }
};

const getServices = async (req, res) => {
  try {
    const services = await servicesModels.find();
    // Si no hay servicios, devolvemos un array vacío, ¡no es un error!
    res.json(services);
  } catch (error) {
    console.error(
      colors.red.bold(`☠️  Error al obtener servicios: ${error.message}`)
    );
    res.status(500).json({
      msg: "Error los servicios se escondieron.",
    });
  }
};

// Usaremos el middleware findServiceByIdMiddleware para getServiceByID, updateService, deleteService
// Por lo tanto, req.service ya estará disponible si se encuentra.

const getServiceByID = async (req, res) => {
  // La validación y búsqueda ya la hizo el middleware 'findServiceByIdMiddleware'
  // Si llegamos aquí, req.service existe.
  res.json(req.service);
};

const updateService = async (req, res) => {
  // La validación y búsqueda ya la hizo el middleware 'findServiceByIdMiddleware'
  // Si llegamos aquí, req.service existe y está en req.service.
  const service = req.service;

  const { name, price } = req.body;

  // Validar que el precio, si se proporciona, sea un número positivo
  if (price !== undefined) {
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      const error = new Error(
        "¿De verdad intentaste poner un precio negativo? Mucha plata eh?"
      );
      return res.status(400).json({ msg: error.message });
    }
    service.price = numericPrice;
  }

  // Actualizamos solo los campos que vienen en el request.
  service.name = name || service.name;

  try {
    await service.save();
    // console.log("Updated");
    res.json({
      msg: "Servicio actualizado con la maestría de un maestro yi 7000000.",
      updatedService: service,
    });
  } catch (error) {
    console.error(
      colors.red.bold(`☠️  Error al actualizar servicio: ${error.message}`)
    );
    if (error.name === "ValidationError") {
      return res.status(400).json({
        msg: "Datos inválidos para actualizar el servicio.",
        details: error.errors,
      });
    }
    res.status(500).json({
      msg: "Hubo un error al actualizar el servicio. Parece que se resistió al cambio.",
    });
  }
};

const deleteService = async (req, res) => {
  // La validación y búsqueda ya la hizo el middleware 'findServiceByIdMiddleware'
  // Si llegamos aquí, req.service existe.
  const service = req.service;

  try {
    await service.deleteOne();
    // console.log(
    //   `borrando toda la base de datos... na bromita solo se borro el seleccionado`
    // );
    res.json({
      msg: "El servicio fue erradicado de la existencia.",
    });
  } catch (error) {
    console.error(
      colors.red.bold(`☠️  Error al borrar servicio: ${error.message}`)
    );
    res.status(500).json({
      msg: "Error interno del servidor. El servicio se aferra a la vida.",
    });
  }
};

export {
  createService,
  getServices,
  getServiceByID,
  updateService,
  deleteService,
  findServiceByIdMiddleware,
};
