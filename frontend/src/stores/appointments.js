import { defineStore } from 'pinia'
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAlertStore } from './useAlertStore'
import AppointmentAPI from '@/api/AppointmentAPI'
import { convertToISO, toYYYYMMDD } from '@/helpers/date'
import { useUserStore } from './user'

export const useAppointmentsStore = defineStore('appointments', () => {
  const appointmentId = ref('')
  const services = ref([])
  const date = ref('')
  const time = ref('')
  const appointmentsByDate = ref([])
  const hours = ref([])

  const user = useUserStore()
  const alertStore = useAlertStore()
  const router = useRouter()

  onMounted(() => {
    const startHour = 10
    const endHour = 19
    for (let hour = startHour; hour <= endHour; hour++) {
      hours.value.push(hour + ':00')
    }
  })

  // Fetch appointments for selected date
  watch(date, async (newDate) => {
    time.value = ''
    if (!newDate) return

    // Prevent weekends
    const parts = newDate.split('-')
    const year = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1
    const dayOfMonth = parseInt(parts[2], 10)
    const selectedDateObject = new Date(year, month, dayOfMonth)
    const dayOfWeek = selectedDateObject.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      alertStore.showAlert('No abrimos los fines de semana.', 'error', 4000)
      date.value = ''
      return
    }

    // Fetch appointments for the date
    try {
      const { data } = await AppointmentAPI.getByDate(newDate)
      if (appointmentId.value) {
        appointmentsByDate.value = data.filter((a) => a._id !== appointmentId.value)
        const current = data.find((a) => a._id === appointmentId.value)
        if (current) time.value = current.time
      } else {
        appointmentsByDate.value = data
      }
    } catch (error) {
      alertStore.showAlert('Error al obtener citas para la fecha.', 'error', 3000)
      console.log(error.message)
    }
  })

  function setSelectedAppointment(appointment) {
    services.value = appointment.services
    // FIX: Use the new helper to format the date correctly for the input
    date.value = toYYYYMMDD(appointment.date)
    time.value = appointment.time
    appointmentId.value = appointment._id
  }

  function onServiceSelected(service) {
    if (services.value.some((selectedService) => selectedService._id === service._id)) {
      services.value = services.value.filter(
        (selectedService) => selectedService._id !== service._id,
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
      date: convertToISO(date.value),
      time: time.value,
      totalAmount: totalAmount.value,
    }

    try {
      if (appointmentId.value) {
        await AppointmentAPI.update(appointmentId.value, appointment)
        alertStore.showAlert('Cita actualizada exitosamente', 'success', 3000)
      } else {
        await AppointmentAPI.create(appointment)
        alertStore.showAlert('Cita creada de manera exitosa', 'success', 3000)
      }
      clearAppointmentData()
      // if (user) user.getUserAppointments() // Uncomment if you have user store
      router.push({ name: 'my-appointments' })
    } catch (error) {
      alertStore.showAlert('Error al guardar la cita', 'error', 3000)
    }
  }

  function clearAppointmentData() {
    appointmentId.value = ''
    services.value = []
    date.value = ''
    time.value = ''
  }

  async function cancelAppointment(id) {
    if (confirm('¿Deseas cancelar esta cita?')) {
      try {
        await AppointmentAPI.delete(id)
        alertStore.showAlert('Cita cancelada exitosamente', 'success', 3000)
        // if (user) user.userAppointments = user.userAppointments.filter(a => a._id !== id)
      } catch (error) {
        alertStore.showAlert('Error al cancelar la cita', 'error', 3000)
      }
    }
  }

  const isServiceSelected = computed(() => {
    return (id) => services.value.some((service) => service._id === id)
  })

  const selectedServicesCount = computed(() => services.value.length)
  const noServicesSelected = computed(() => services.value.length === 0)
  const totalAmount = computed(() =>
    services.value.reduce((total, service) => total + service.price, 0),
  )

  const isValidReservation = computed(() => {
    return (
      services.value.length > 0 &&
      date.value.length > 0 &&
      date.value !== '' &&
      time.value.length > 0
    )
  })

  const isDateSelected = computed(() => !!date.value)

  const disableTime = computed(() => {
    return (hour) => appointmentsByDate.value.some((appointment) => appointment.time === hour)
  })

  return {
    appointmentId,
    services,
    date,
    hours,
    time,
    appointmentsByDate,
    setSelectedAppointment,
    onServiceSelected,
    saveAppointment,
    clearAppointmentData,
    cancelAppointment,
    isServiceSelected,
    noServicesSelected,
    selectedServicesCount,
    totalAmount,
    isValidReservation,
    isDateSelected,
    disableTime,
  }
})
