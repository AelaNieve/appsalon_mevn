<script setup>
import ServiceItem from './ServiceItem.vue'
import { userServicesStore } from '../../stores/services.js'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppointmentsStore } from '../../stores/appointments.js'

const servicesDisplayStore = userServicesStore()

const appointmentsStore = useAppointmentsStore()
const router = useRouter()
const showAlert = ref(false)

// When one or more services are selected the alert will be shown automatically.
// The 'immediate' option ensures the watcher is triggered on initialization.
watch(
  () => appointmentsStore.selectedServicesCount,
  (newCount) => {
    showAlert.value = newCount > 0
  },
  { immediate: true },
)

function continueToAppointment() {
  showAlert.value = false
  router.push({ name: 'appointment-details' })
}
</script>

<template>
  <div class="flex items-center justify-center mb-5">
    <div
      class="flex max-w-md overflow-hidden rounded-xl shadow-lg border border-gray-200 bg-gradient-to-r from-white via-pastel-lilac to-light-mauve transition-transform duration-300 hover:scale-105"
    >
      <div class="p-6">
        <h1 class="text-center text-xl font-bold text-deep-plum">
          Agradecemos su preferencia. Por favor, seleccione su servicio.
        </h1>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 m-5">
    <ServiceItem
      v-for="service in servicesDisplayStore.services"
      :key="service._id"
      :service="service"
    />
  </div>
  <!-- Alert Toast -->
  <transition name="slide-up">
    <div
      v-if="showAlert"
      role="alert"
      aria-live="assertive"
      class="fixed bottom-5 left-1/2 transform -translate-x-1/2 rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 border-4 backdrop-blur-sm alert-container"
      style="border-color: var(--color-light-mauve)"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold alert-heading">
          Has seleccionado {{ appointmentsStore.selectedServicesCount }} servicio(s)
        </h2>
        <button
          @click="continueToAppointment"
          class="flex items-center px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 alert-button"
          style="border-color: var(--color-muted-grape)"
        >
          Continuar
          <svg
            class="w-5 h-5 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide up transition for the toast */
.slide-up-enter-active,
.slide-up-leave-active {
  transition:
    transform 0.3s,
    opacity 0.3s;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
