import mongoose from "mongoose";

// Esquema para los servicios, aquí demostramosla magia que ofrecemos
const servicesSchema = mongoose.Schema({
  name: {
    type: String,
    required: [
      true,
      "El nombre del servicio es más que obligatorio, ¡es la estrella!",
    ],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Sin precio no hay paraíso (ni servicio)."],
    trim: true,
    min: [
      0.01,
      "El precio debe ser mayor que cero, no trabajamos gratis (casi...)",
    ],
  },
});

// Modelo para los servicios, con este interactuamos en la base de datos
const servicesModels = mongoose.model("Services", servicesSchema);
export default servicesModels;
