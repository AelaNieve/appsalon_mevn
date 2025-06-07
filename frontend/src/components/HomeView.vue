<script setup>
import { onMounted } from 'vue'
import { useAlertStore } from '@/stores/useAlertStore'
import CustomAlert from '@/views/CustomAlert.vue'

const alertStore = useAlertStore()

// Define an array of alert configurations to test
//const testAlerts = [
//  { message: 'Alerta de exito!', type: 'success', duration: 4000 },
//  { message: 'Alerta de error!', type: 'error', duration: 5000 },
//  { message: 'Alerta de advertencia!', type: 'warning', duration: 6000 },
//  { message: 'Alerta de información.', type: 'info', duration: 3000 },
//  { message: 'Alerta default.', type: 'default', duration: 3500 },
//]

//onMounted(() => {
//  let delay = 0
//  testAlerts.forEach((alert, index) => {
//    // Show alerts sequentially with a delay
//    setTimeout(() => {
//      alertStore.showAlert(alert.message, alert.type, alert.duration)
//    }, delay)
//    // Increase delay for the next alert
//    delay += 1000 // Each alert will appear 1 second after the previous one
//  })
//})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-[200px] bg-pastel-lilac rounded-lg shadow-md p-8"
  >
    <h1 class="text-3xl font-bold text-dark-indigo mb-2">Hello, Tailwind!</h1>
    <p class="text-muted-grape text-lg">
      This is a <span class="font-semibold text-deep-plum">badly formatted</span> HelloWorld
      component.
    </p>
  </div>
  <button
    @click="alertStore.showAlert('Alerta de exito desde boton.', 'success')"
    class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
  >
    Mostrar alerta de información
  </button>

  <div class="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col space-y-3">
    <CustomAlert
      v-for="alert in alertStore.alerts"
      :key="alert.id"
      :id="alert.id"
      :message="alert.message"
      :type="alert.type"
      @close="alertStore.dismissAlert(alert.id)"
    />
  </div>
</template>

<!---->
