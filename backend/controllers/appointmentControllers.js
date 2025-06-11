import Appointment from '../models/appointment.js'

const createAppointment = async (req, res) => {

    try {
        const appointment = req.body
        appointment.user = req.user._id.toString()
        //console.log(appointment)
        const newAppointment = new Appointment(appointment)
        const result = await newAppointment.save()
        //console.log(result)
        res.json({
            msg: 'Cita creada correctamente',
        })
    } catch (error) {
        console.log(error)
    }
}

const getAppointmentsByDate = async (req, res ) => {
    try {
        const { date } = req.query
        const appointments = await Appointment.find({ date: date }).select('time')
        console.log(appointments)
        res.json(appointments)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Error al obtener las citas' })
    }
}

export {
    createAppointment,
    getAppointmentsByDate
}