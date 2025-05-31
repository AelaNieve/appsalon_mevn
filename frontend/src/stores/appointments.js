import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppointmentsStore = defineStore('appointments', () => {
  const services = ref([])

  function onServiceSelected(service) {
    if (services.value.some((selectedService) => selectedService._id == service._id)) {
      console.log('Este servicio ya esta en la cita')
    } else {
      services.value.push(service)
    }
  }

  const isServiceSelected = computed(() => {
    return (id) => services.value.some((selectedService) => selectedService._id === id)
  })

  return {
    onServiceSelected,
    isServiceSelected,
  }
})
