import { defineStore } from 'pinia'
import { ref, computed, onMounted, watch } from 'vue'
import { useAlertStore } from './useAlertStore' // Import the alert store

export const useAppointmentsStore = defineStore('appointments', () => {
  const services = ref([])
  const date = ref('') // Date for the appointment
  const hours = ref([]) // Available hours
  const time = ref('') // Selected time

  const alertStore = useAlertStore() // Initialize the alert store

  function onServiceSelected(service) {
    if (services.value.some((selectedService) => selectedService._id == service._id)) {
      services.value = services.value.filter(
        (selectedService) => selectedService._id != service._id,
      )
    } else {
      if (services.value.length >= 2) {
        // Use the alert store to show the max services alert
        alertStore.showAlert('Solo puedes agendar 2 servicios por cita.', 'warning', 4000)
        return
      }
      services.value.push(service)
    }
  }

  function createAppointment() {
    const appointment = {
      services: services.value.map((service) => service._id),
      date: date.value,
      time: time.value,
      totalAmount: totalAmount.value,
    }
    console.log(appointment)
    // Optionally, show a success alert after creating an appointment
    alertStore.showAlert('Cita creada de manera exitosa', 'success', 3000)
  }

  const isServiceSelected = computed(() => {
    return (id) => services.value.some((selectedService) => selectedService._id === id)
  })

  const selectedServicesCount = computed(() => services.value.length)

  const noServicesSelected = computed(() => services.value.length === 0)

  const totalAmount = computed(() => {
    return services.value.reduce((total, service) => total + service.price, 0)
  })

  onMounted(() => {
    const startHour = 10
    const endHour = 19
    for (let hour = startHour; hour <= endHour; hour++) {
      hours.value.push(hour + ':00')
    }
  })

  // Watch for changes in the selected date
  watch(date, (newDate) => {
    if (newDate) {
      const parts = newDate.split('-')
      const year = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10) - 1
      const dayOfMonth = parseInt(parts[2], 10)

      const selectedDateObject = new Date(year, month, dayOfMonth)
      const dayOfWeek = selectedDateObject.getDay() // 0 for Sunday, 6 for Saturday

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Use the alert store to show the weekend alert
        alertStore.showAlert('No abrimos los fines de semana.', 'error', 4000)
        date.value = '' // Reset the date
      }
    }
  })

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
    createAppointment,
    onServiceSelected,
    isServiceSelected,
    noServicesSelected,
    selectedServicesCount,
    date,
    hours,
    time,
    isValidReservation,
  }
})
