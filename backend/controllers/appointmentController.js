import Appointment from "../models/appointment.js";

const createAppointment = async (req, res) => {
  const appointment = req.body;
  appointment.user = req.user._id.toString();
  console.log(appointment);

  try {
    const NewAppointment = new Appointment(appointment);
    await NewAppointment.save();
    res.json({
      msg: "Tu Reservación se realizó correctamente",
    });
  } catch (error) {
    console.log(error);
  }
};

export { createAppointment };
