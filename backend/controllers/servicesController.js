import colors from "colors";
import servicesModels from "../models/servicesModels.js";
import { isValidObjectId, serviceExists } from "../helpers/errorHandling.js";

// Función para buscar servicios y evitar el codigo repetido
const findServiceByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    // console.warn(colors.yellow(`⚠️ el id no tiene formato valido: ${id}`));
    return res.status(400).json({
      msg: "El ID proporcionado no es válido. ¿Estás inventando cosas?",
    });
  }

  try {
    const service = await servicesModels.findById(id);
    if (!serviceExists(service)) {
      // console.warn(colors.yellow(`⚠️ Service with ID '${id}' not found.`));
      return res.status(404).json({
        msg: `El servicio con ID '${id}' no fue encontrado. ¿Quizas alguien quito este servicio?`,
      });
    }
    // console.log(colors.green(`✅ Service found: ${service.name}`));
    req.service = service;
    next();
  } catch (error) {
    console.error(
      colors.red.bold(
        `☠️  Error en findServiceByIdMiddleware buscando servicio por ID (${id}): ${error.message}`
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
    // console.warn(colors.yellow("⚠️ Se intento crear un servicio vacio."));
    return res.status(400).json({
      msg: "De verdad intentaste mandar un servicio vacio? no jodas",
    });
  }

  const price = parseFloat(req.body.price);
  if (isNaN(price) || price <= 0) {
    // console.warn(colors.yellow(`⚠️Formato de precio es invalido: ${req.body.price}`));
    return res.status(400).json({
      msg: "El precio debe ser un número positivo. A menos que te guste trabajar gratis",
    });
  }

  try {
    const service = new servicesModels(req.body);
    await service.save();
    // console.log(colors.green.bold(`🎉 Servicio creado exitosamente: ${service.name}, ID: ${service._id}`));
    res.status(201).json({
      msg: "Servicio creado con el poder de mil soles",
      service,
    });
  } catch (error) {
    console.error(
      colors.red.bold(`☠️  Error al crear servicio: ${error.message}`)
    );
    if (error.name === "ValidationError") {
      console.warn(
        colors.yellow(
          `⚠️ Error de validación a la hora de crear el servicio: ${JSON.stringify(
            error.errors
          )}`
        )
      );
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
    // console.log(colors.green(`✅ Se consiguio: ${services.length} de services.`));
    res.status(200).json({
      msg:
        services.length > 0
          ? "Servicios obtenidos exitosamente."
          : "No hay servicios registrados aún.",
      services,
    });
  } catch (error) {
    console.error(
      colors.red.bold(`☠️  Error al obtener servicios: ${error.message}`)
    );
    res.status(500).json({
      msg: "Error los servicios se escondieron.",
    });
  }
};

const getServiceByID = async (req, res) => {
  // console.log(colors.cyan(`ℹ️ Devolviendo servicio: ${req.service.name} (ID: ${req.service._id})`));
  res.status(200).json({
    msg: "Servicio encontrado exitosamente.",
    service: req.service,
  });
};

const updateService = async (req, res) => {
  const service = req.service;
  const { id } = req.params;
  // console.log(colors.cyan(`🛠️ Intentando actualizar servicio ID: ${id} with data:`), req.body);

  const { name, price } = req.body;

  if (price !== undefined) {
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      // console.warn(colors.yellow(`⚠️ Numero negativo de: ${price}`));
      return res.status(400).json({
        msg: "¿De verdad intentaste poner un precio negativo? Mucha plata eh?",
      });
    }
    service.price = numericPrice;
  }

  if (name !== undefined) {
    service.name = name;
  }

  // Revisión si se realizaron cambios
  if (Object.keys(req.body).length === 0) {
    // console.warn(colors.yellow(`⚠️ Se intento actualizar un servicio ID: ${id} con un espacio vacio.`));
    return res
      .status(400)
      .json({ msg: "No se proporcionaron datos para actualizar." });
  }

  try {
    await service.save();
    // console.log(colors.green.bold(`🔧 Servicio actualizado exitosamente: ${service.name}, ID: ${service._id}`));
    res.status(200).json({
      msg: "Servicio actualizado con la maestría de un maestro yi 7000000.",
      updatedService: service,
    });
  } catch (error) {
    console.error(
      colors.red.bold(
        `☠️  Error al actualizar servicio (ID: ${id}): ${error.message}`
      )
    );
    if (error.name === "ValidationError") {
      // console.warn(colors.yellow(`⚠️ Error de validación en la actualización de ID ${id}: ${JSON.stringify(error.errors)}`));
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
  const { id } = req.params;
  try {
    await service.deleteOne();
    // console.log(colors.green.bold(`💀 Servicio eliminado exitosamente: ${service.name}, ID: ${id}`));
    res.status(200).json({
      msg: "El servicio fue erradicado de la existencia.",
    });
  } catch (error) {
    console.error(
      colors.red.bold(
        `☠️  Error al borrar servicio (ID: ${id}): ${error.message}`
      )
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
