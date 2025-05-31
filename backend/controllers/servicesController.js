import servicesModels from "../models/servicesModels.js";
import {
  validateObjectId,
  validateServiceId,
  handleNotFoundError,
} from "../helpers/errorHandeling.js";

const createService = async (req, res) => {
  if (Object.values(req.body).includes("")) {
    const error = new Error("falta data we");
    return res.status(400).json({
      msg: error.message,
    });
  }

  try {
    const service = new servicesModels(req.body);
    await service.save();
    const exito = "si llego we";
    console.log(service, exito);
    res.json({
      msg: exito,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const getServices = async (req, res) => {
  try {
    const services = await servicesModels.find();
    res.json(services);
  } catch (error) {
    console.log(error);
  }
};

const getServiceByID = async (req, res) => {
  const { id } = req.params;

  if (validateObjectId(id)) {
    return handleNotFoundError("Te inventaste la id we", res, 400);
  } else {
    console.log(`La id ingresada existe: ${id}`);
  }

  const service = await servicesModels.findById(id);

  if (validateServiceId(service)) {
    return handleNotFoundError("Alguien se saco el servicio del jaimico", res);
  } else {
    console.log(`El servicio ${service} existe`);
  }

  res.json(service);
};

const updateService = async (req, res) => {
  console.log(req.body);
  const { id } = req.params;

  if (validateObjectId(id)) {
    return handleNotFoundError(
      "Te inventaste la id, el update no fue valido",
      res,
      400
    );
  } else {
    console.log(`La id ingresada existe: ${id}`);
  }

  const service = await servicesModels.findById(id);

  if (validateServiceId(service)) {
    return handleNotFoundError(
      "Alguien se saco el servicio del jaimico y el update tambien desaparecio",
      res
    );
  } else {
    console.log(`El servicio ${service} existe`);
  }

  service.name = req.body.name || service.name;
  service.price = req.body.price || service.price;

  try {
    await service.save();
    console.log("Updated");
    res.json({
      msg: "Servicio actualizado con éxito",
      updatedService: service,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Hubo un error al actualizar el servicio",
    });
  }
};

const deleteService = async (req, res) => {
  const { id } = req.params;

  if (validateObjectId(id)) {
    return handleNotFoundError(
      "Te inventaste la id, no puedes borrar nada",
      res,
      400
    );
  } else {
    console.log(`La id ingresada existe: ${id}`);
  }

  const service = await servicesModels.findById(id);

  if (validateServiceId(service)) {
    return handleNotFoundError(
      "Noup server no valido para borrar la data",
      res
    );
  } else {
    console.log(`El servicio ${service} existe`);
  }

  try {
    await service.deleteOne();
    console.log(
      `borrando toda la base de datos... na bromita solo se borro el seleccionado`
    );
    res.json({
      msg: "El servicio fue erradicado de la existencia",
    });
  } catch (error) {
    console.log(error);
  }
};

export {
  createService,
  getServices,
  getServiceByID,
  updateService,
  deleteService,
};
