import Appointment from "../models/appointment.js";
import { isValidObjectId, serviceExists } from "../helpers/errorHandling.js";

const createAppointment = async (req, res) => {
  try {
    const appointment = req.body;
    appointment.user = req.user._id.toString();
    //console.log(appointment)
    const newAppointment = new Appointment(appointment);
    const result = await newAppointment.save();
    //console.log(result)
    res.json({
      msg: "Cita creada correctamente",
    });
  } catch (error) {
    console.log(error);
  }
};

const getAppointmentsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const appointments = await Appointment.find({ date: date }).select("time");
    console.log(appointments);
    res.json(appointments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al obtener las citas" });
  }
};

const getAppointmentById = async (req, res) => {
    const { id } = req.params
    // Validar por object id
    if(!isValidObjectId(id))
      return res.status(400).json({ msg: 'El ID proporcionado no es válido. ¿Estás inventando cosas?' }); 
    // Validar que exista
    const appointment = await Appointment.findById(id).populate('services')
    if(!appointment) {
      return res.status(404).json({ msg: 'La Cita no existe' });
    }
    if(appointment.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({msg: 'No tienes los permisos'})
    }

    // Retornar la cita
    res.json(appointment)
}

export { createAppointment, getAppointmentsByDate, getAppointmentById };
