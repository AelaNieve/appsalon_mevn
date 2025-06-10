import { parse, formatISO, startOfDay, endOfDay, isValid } from 'date-fns'
import Appointment from '../models/appointment.js'
import { 
  sendEmailNewAppointment, 
  sendEmailUpdateAppointment, 
  sendEmailCancelledAppointment 
} from '../emails/authEmailService.js'
import { isValidObjectId, formatDate } from '../helpers/errorHandling.js'
import colors from 'colors'

export const createAppointment = async (req, res) => {
  const appointment = req.body
  appointment.user = req.user._id.toString()
  try {
    const newAppointment = new Appointment(appointment)
    const result = await newAppointment.save()

    await sendEmailNewAppointment({
      date: formatDate(result.date),
      time: result.time,
    })

    res.json({
      msg: 'Tu Reservación se realizó correctamente',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Error al crear la cita' })
  }
}

export const getAppointmentsByDate = async (req, res ) => {
    const { date } = req.query

    const newDate = parse(date, 'dd/MM/yyyy', new Date())

    if(!isValid(newDate)) {
        const error = new Error('Fecha no válida')
        return res.status(400).json({  msg: error.message })
    }

    const isoDate = formatISO(newDate)
    const appointments = await Appointment.find({ date: {
        $gte : startOfDay(new Date(isoDate)),
        $lte: endOfDay(new Date(isoDate))
    }}).select('time')

    res.json(appointments)
}

export const getAppointmentById = async (req, res) => {
    const { id } = req.params

    if (validateObjectId(id, res)) return

    const appointment = await Appointment.findById(id).populate('services')
    if (!appointment) {
        return res.status(404).json({ msg: 'La Cita no existe' }) // changed
    }

    if (appointment.user.toString() !== req.user._id.toString()) {
        const error = new Error('No tienes los permisos')
        return res.status(403).json({ msg: error.message })
    }

    res.json(appointment)
}

export const updateAppointment = async (req, res) => {
    const { id } = req.params

    if (validateObjectId(id, res)) return

    const appointment = await Appointment.findById(id).populate('services')
    if (!appointment) {
        return res.status(404).json({ msg: 'La Cita no existe' }) // changed
    }

    if (appointment.user.toString() !== req.user._id.toString()) {
        const error = new Error('No tienes los permisos')
        return res.status(403).json({ msg: error.message })
    }

    const { date, time, totalAmount, services } = req.body
    appointment.date = date
    appointment.time = time
    appointment.totalAmount = totalAmount
    appointment.services = services

    try {
        const result = await appointment.save()

        await sendEmailUpdateAppointment({
            date: formatDate( result.date ),
            time: result.time
        })

        res.json({
            msg: 'Cita Actualizada Correctamente',
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Error al actualizar la cita' })
    }
}

export const deleteAppointment = async (req, res) => {
    const { id } = req.params

    if (validateObjectId(id, res)) return

    const appointment = await Appointment.findById(id).populate('services')
    if (!appointment) {
        return res.status(404).json({ msg: 'La Cita no existe' }) // changed
    }

    if (appointment.user.toString() !== req.user._id.toString()) {
        const error = new Error('No tienes los permisos')
        return res.status(403).json({ msg: error.message })
    }

    try {
        const result = await appointment.deleteOne()

        await sendEmailCancelledAppointment({
            date: formatDate( result.date ),
            time: result.time
        })

        res.json({ msg: 'Cita Cancelada Exitosamente' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Error al cancelar la cita' })
    }
}

// Example: Create Appointment
export const createAppointmentExample = async (req, res) => {
  const { userId, serviceId, date, time } = req.body;

  // Basic validation
  if (!userId || !serviceId || !date || !time) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios." });
  }

  // Validate ObjectIds
  if (!isValidObjectId(userId) || !isValidObjectId(serviceId)) {
    return res.status(400).json({ msg: "ID de usuario o servicio no válido." });
  }

  try {
    const appointment = new Appointment({ user: userId, service: serviceId, date, time });
    await appointment.save();
    return res.status(201).json({ msg: "Cita creada exitosamente.", appointment });
  } catch (error) {
    console.error(colors.red.bold(`☠️  Error al crear cita: ${error.message}`));
    return res.status(500).json({ msg: "Error interno del servidor al crear la cita." });
  }
};

// Example: Get Appointment by ID
export const getAppointmentExample = async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!isValidObjectId(id)) {
    return res.status(400).json({ msg: "El ID de la cita no es válido." });
  }

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ msg: "Cita no encontrada." });
    }
    return res.status(200).json(appointment);
  } catch (error) {
    console.error(colors.red.bold(`☠️  Error al obtener cita: ${error.message}`));
    return res.status(500).json({ msg: "Error interno del servidor al obtener la cita." });
  }
};

// Example: Delete Appointment
export const deleteAppointmentExample = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ msg: "El ID de la cita no es válido." });
  }

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ msg: "Cita no encontrada." });
    }
    await Appointment.deleteOne({ _id: id });
    return res.status(200).json({ msg: "Cita eliminada correctamente." });
  } catch (error) {
    console.error(colors.red.bold(`☠️  Error al eliminar cita: ${error.message}`));
    return res.status(500).json({ msg: "Error interno del servidor al eliminar la cita." });
  }
};


