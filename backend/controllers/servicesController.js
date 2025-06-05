import colors from "colors";
import servicesModels from "../models/servicesModels.js";
import {
  isValidObjectId,
  handleNotFoundError,
  serviceExists,
} from "../helpers/errorHandling.js";

// Aquí revisamos si el ID es de verdad y si el servicio existe.
const findServiceByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return handleNotFoundError(
      "El ID proporcionado no es válido. ¿Estás inventando cosas?",
      res,
      400
    );
  }

  try {
    const service = await servicesModels.findById(id);
    if (!serviceExists(service)) {
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
    return handleNotFoundError(
      "De verdad intentaste mandar un servicio vacio? no jodas",
      res,
      400
    );
  }

  const price = parseFloat(req.body.price);
  if (isNaN(price) || price <= 0) {
    return handleNotFoundError(
      "El precio debe ser un número positivo. A menos que te guste trabajar gratis",
      res,
      400
    );
  }

  try {
    const service = new servicesModels(req.body);
    await service.save();
    res.status(201).json({
      msg: "Servicio creado con el poder de mil soles",
      service,
    });
  } catch (error) {
    console.error(
      colors.red.bold(`☠️  Error al crear servicio: ${error.message}`)
    );
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

// El mensaje de error esta en findServiceByIdMiddleware en errorHandeling.js
const getServiceByID = async (req, res) => {
  res.json(req.service);
};

// El mensaje de error esta en findServiceByIdMiddleware en errorHandeling.js
const updateService = async (req, res) => {
  const service = req.service;
  const { name, price } = req.body;

  if (price !== undefined) {
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return handleNotFoundError(
        "¿De verdad intentaste poner un precio negativo? Mucha plata eh?",
        res,
        400
      );
    }
    service.price = numericPrice;
  }

  service.name = name || service.name;

  try {
    await service.save();
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
  const service = req.service;
  try {
    await service.deleteOne();
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
