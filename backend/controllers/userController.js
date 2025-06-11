import Appointment from "../models/appointment.js";

const getUserAppointments = async (req, res) => {
    const { user } = req.params;

    if(user !== req.user._id.toString() && !req.user.admin) {
        console.log('Acceso Denegado: User ID mismatch');
        return res.status(400).json({ msg: 'Acceso Denegado' })
    }
  
    try {
        // Get the current date and set the time to 00:00:00.000Z (UTC)
        const now = new Date();
        now.setUTCHours(0, 0, 0, 0);

        const query = req.user.admin 
            ? { date: { $gte: now } } 
            : { user, date: { $gte: now } };

        const appointments = await Appointment.find(query)
            .populate('services')
            //.populate({ path: 'user', select: 'name email' })
            .sort({ date: 'asc' })
            .select('-__v -createdAt -updatedAt -user -date -time -totalAmount');

        res.json(appointments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server Error" });
    }
};

export {
    getUserAppointments
};