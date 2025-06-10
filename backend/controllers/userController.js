import Appointment from "../models/appointment.js";

// Obtener las citas del usuario autenticado (o todas si es admin)
export const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const isAdmin = req.user.admin;

    // Si es admin, ve todas las citas futuras; si no, solo las suyas
    const query = isAdmin
      ? { date: { $gte: new Date() } }
      : { user: userId, date: { $gte: new Date() } };

    const appointments = await Appointment.find(query)
      .populate("services")
      .populate({ path: "user", select: "name email" })
      .sort({ date: "asc" });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener las citas del usuario" });
  }
};