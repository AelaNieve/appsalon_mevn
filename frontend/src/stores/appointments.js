import { defineStore } from 'pinia'
import { ref, computed, onMounted, watch } from 'vue'
import { useAlertStore } from './useAlertStore' // Import the alert store
import { useRouter } from 'vue-router'
import AppointmentAPI from '@/api/AppointmentAPI'

export const useAppointmentsStore = defineStore('appointments', () => {
  
  const appointmentId = ref('') // To store the selected appointment ID
  const services = ref([])
  const date = ref('') // Date for the appointment
  const time = ref('') // Selected time
  const hours = ref([]) // Available hours
  const appointmentsByDate = ref([]) // To store appointments for the selected date
  const router = useRouter()

  const alertStore = useAlertStore() // Initialize the alert store

  onMounted(() => {
    const startHour = 10
    const endHour = 19
    for (let hour = startHour; hour <= endHour; hour++) {
      hours.value.push(hour + ':00')
    }
  })

  // Watch for changes in the selected date to fetch appointments
  watch(date, async (newDate) => {
    time.value = '' // Reset time when date changes
    if (!newDate) {
      appointmentsByDate.value = []
      return
    }

    const parts = newDate.split('-')
    const year = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1
    const dayOfMonth = parseInt(parts[2], 10)

    const selectedDateObject = new Date(year, month, dayOfMonth)
    const dayOfWeek = selectedDateObject.getDay() // 0 for Sunday, 6 for Saturday

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      alertStore.showAlert('No abrimos los fines de semana.', 'error', 4000)
      date.value = '' // Reset the date
      appointmentsByDate.value = []
      return
    }

    // Fetch appointments for the selected date from the API
    try {
      const { data } = await AppointmentAPI.getByDate(newDate)
      if (!appointmentId.value) {
        console.log('Nuevas Citas')
        appointmentsByDate.value = data
      }
      else {
        appointmentsByDate.value = data.filter( appointment => appointment._id !==  appointmentId.value)
        time.value = data.filter( appointment => appointment._id ===  appointmentId.value)[0].time
        } 
    } catch (error) {
      console.error('Error fetching appointments:', error)
      alertStore.showAlert('Error al consultar las citas.', 'error', 3000)
      appointmentsByDate.value = []
    }
  })

    function setSelectedAppointment(appointment) {
      services.value = appointment.services
      date.value = appointment.date.substring(0, 10)
      time.value = appointment.time
      appointmentId.value = appointment._id

  }
  function onServiceSelected(service) {
    if (services.value.some((selectedService) => selectedService._id == service._id)) {
      services.value = services.value.filter(
        (selectedService) => selectedService._id != service._id,
      )
    } else {
      if (services.value.length >= 2) {
        alertStore.showAlert('Solo puedes agendar 2 servicios por cita.', 'warning', 4000)
        return
      }
      services.value.push(service)
    }
  }

  async function saveAppointment() {
    const appointment = {
      services: services.value.map((service) => service._id),
      date: date.value,
      time: time.value,
      totalAmount: totalAmount.value,
    }
    if (appointmentId.value) {
      try {
        await AppointmentAPI.update(appointmentId.value, appointment) 
        alertStore.showAlert('Cita actualizada de manera exitosa', 'success', 3000)
      } catch (error) {
        console.error('Error actualizando la cita:', error)
        alertStore.showAlert('No se pudo actualizar la cita', 'error', 3000)
      }
    } else {
      try {
        await AppointmentAPI.create(appointment)

        alertStore.showAlert('Cita creada de manera exitosa', 'success', 3000)
      } catch (error) {
        console.error('Error creating appointment:', error)
      }
    }
    clearAppointmentData()
    router.push({ name: 'my-appointments' })
  }


  function clearAppointmentData() {
    services.value = []
    date.value = ''
    time.value = ''
    appointmentsByDate.value = []
  }

  async function deleteAppointment(id) {
    try {
        await AppointmentAPI.remove(id)
        alertStore.showAlert('Cita eliminada de manera exitosa', 'success', 3000)
    } catch (error) {
        console.error('Error deleting appointment:', error)
        alertStore.showAlert('No se pudo eliminar la cita', 'error', 3000)
        // Re-throw the error so the component knows the operation failed
        throw error
    }
  }

  // Check if a time slot is already taken
  function isTimeTaken(hour) {
    return appointmentsByDate.value.some((appointment) => appointment.time === hour)
  }

  const isServiceSelected = computed(() => {
    return (id) => services.value.some((selectedService) => selectedService._id === id)
  })

  const selectedServicesCount = computed(() => services.value.length)

  const noServicesSelected = computed(() => services.value.length === 0)

  const totalAmount = computed(() => {
    return services.value.reduce((total, service) => total + service.price, 0)
  })

  const isDateSelected = computed(() => !!date.value)

  const isValidReservation = computed(() => {
    return (
      services.value.length > 0 &&
      date.value.length > 0 &&
      date.value !== '' &&
      time.value.length > 0
    )
  })

  return {
    totalAmount,
    services,
    saveAppointment,
    onServiceSelected,
    isServiceSelected,
    noServicesSelected,
    selectedServicesCount,
    date,
    hours,
    time,
    isDateSelected,
    isValidReservation,
    isTimeTaken,
    setSelectedAppointment,
    clearAppointmentData,
    deleteAppointment
  }
})
