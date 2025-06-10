import mongoose from "mongoose";

// Esquema para los servicios, aquí demostramosla magia que ofrecemos
const appointmentSchema = mongoose.Schema({
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Services",
    },
  ],
  date: {
    type: Date,
  },
  time: {
    type: String,
  },
  totalAmount: {
    type: Number,
  },
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

// Modelo para los servicios, con este interactuamos en la base de datos
const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
