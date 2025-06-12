import Appointment from "../models/appointment.js";

const getUserAppointments = async (req, res) => {
    const { user } = req.params;

    if (user !== req.user._id.toString()) {
        return res.status(400).json({ msg: "Acceso Denegado" });
    }

    try {
        const now = new Date();
        now.setUTCHours(0, 0, 0, 0);

        let query;

        if (req.user.admin) {
            // If the user is an admin, fetch all appointments and populate user info.
            query = Appointment.find({ date: { $gte: now } })
                .populate("services")
                .populate({
                    path: "user",
                    select: "name email", // Populate the user's name and email.
                })
                .sort({ date: "asc" });
        } else {
            // If a regular user, fetch only their appointments.
            // Populating the user field isn't necessary here.
            query = Appointment.find({ user, date: { $gte: now } })
                .populate("services")
                .sort({ date: "asc" });
        }

        const appointments = await query;
        res.json(appointments);

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server Error" });
    }
};

export { getUserAppointments };
