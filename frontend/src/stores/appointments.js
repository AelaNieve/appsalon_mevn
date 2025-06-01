import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppointmentsStore = defineStore('appointments', () => {
  const services = ref([])
  const showMaxServicesAlert = ref(false)

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

  function dismissMaxServicesAlert() {
    showMaxServicesAlert.value = false
  }

  const isServiceSelected = computed(() => {
    return (id) => services.value.some((selectedService) => selectedService._id === id)
  })

  const selectedServicesCount = computed(() => services.value.length)

  const totalAmount = computed(() => {
    return services.value.reduce((total, service) => total + service.price, 0)
  })

  return {
    totalAmount,
    services,
    onServiceSelected,
    isServiceSelected,
    showMaxServicesAlert,
    dismissMaxServicesAlert,
    selectedServicesCount,
  }
})
