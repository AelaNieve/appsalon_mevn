import express from "express";
import {
  createService,
  getServices,
  getServiceByID,
  updateService,
  deleteService,
  findServiceByIdMiddleware,
} from "../controllers/servicesController.js";

const router = express.Router();

// GET api/services - Para ver todos los servicios
router.get("/", getServices);

// POST api/services
router.post("/", createService);

// Rutas que operan sobre un servicio específico por ID
// Usamos el middleware 'findServiceByIdMiddleware' para validar el ID y cargar el servicio.
// Así nos ahorramos repetir código
router.get("/:id", findServiceByIdMiddleware, getServiceByID); // GET api/services/:id - Detalles de un servicio
router.put("/:id", findServiceByIdMiddleware, updateService); // PUT api/services/:id - Para tunear un servicio existente.
router.delete("/:id", findServiceByIdMiddleware, deleteService); // DELETE api/services/:id - Adiós servicio, fue un placer... (O no?).

export default router;
