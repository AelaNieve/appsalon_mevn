import { defineStore } from 'pinia'
import { ref, computed, onMounted, watch } from 'vue' // Import watch

export const useAppointmentsStore = defineStore('appointments', () => {
  const services = ref([])
  const showMaxServicesAlert = ref(false)
  const showWeekendAlert = ref(false) // New ref for weekend alert

  const date = ref('') // Date for the appointment
  const hours = ref([]) // Available hours
  const time = ref('') // Selected time

  function onServiceSelected(service) {
    if (services.value.some((selectedService) => selectedService._id == service._id)) {
      services.value = services.value.filter(
        (selectedService) => selectedService._id != service._id,
      )
    } else {
      if (services.value.length >= 2) {
        showMaxServicesAlert.value = true
        setTimeout(() => {
          if (showMaxServicesAlert.value) {
            dismissMaxServicesAlert()
          }
        }, 4000)
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
  }

  function dismissMaxServicesAlert() {
    showMaxServicesAlert.value = false
  }

  // New function to dismiss the weekend alert
  function dismissWeekendAlert() {
    showWeekendAlert.value = false
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
      // The date from <input type="date"> is in 'YYYY-MM-DD' format.
      // To reliably get the day of the week in the user's local timezone:
      const parts = newDate.split('-') // e.g., "2024-06-01" -> ["2024", "06", "01"]
      const year = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10) - 1 // Month is 0-indexed in JavaScript Date (0 for January, 11 for December)
      const dayOfMonth = parseInt(parts[2], 10)

      const selectedDateObject = new Date(year, month, dayOfMonth)
      const dayOfWeek = selectedDateObject.getDay() // 0 for Sunday, 6 for Saturday

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Check if it's a Sunday or Saturday
        showWeekendAlert.value = true // Set the ref to true to show the custom alert
        setTimeout(() => {
          if (showWeekendAlert.value) {
            dismissWeekendAlert()
          }
        }, 4000)
        date.value = '' // Reset the date
        // Optionally, if a time was selected based on this date, you might want to reset it too:
        // time.value = '';
      }
    }
  })

  const isValidReservation = computed(() => {
    // Ensures all necessary fields are filled and the date is valid (not a weekend, as it would be reset)
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
    showMaxServicesAlert,
    dismissMaxServicesAlert,
    showWeekendAlert, // Expose the new ref
    dismissWeekendAlert, // Expose the new function
    selectedServicesCount,
    date,
    hours,
    time,
    isValidReservation,
  }
})
