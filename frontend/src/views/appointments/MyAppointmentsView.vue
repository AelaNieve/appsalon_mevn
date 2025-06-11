<script setup>
import { useUserStore } from '../../stores/user.js'
import Appointment from './MyAppointmentView.vue'
import { useRouter } from 'vue-router'

const user = useUserStore()
const router = useRouter()

// Function to navigate to the new appointment/services page
function bookNewAppointment() {
  // Assuming 'new-appointment' is the name of the route that leads to your ServicesView
  router.push({ name: 'new-appointment' })
}

// Props
const reloadPage = () => {
  window.location.reload()
}
</script>

<template>
  <div class="flex items-center justify-center my-5 px-5">
    <div
      class="w-full max-w-md overflow-hidden rounded-xl shadow-lg border border-gray-200 bg-gradient-to-r from-white via-pastel-lilac to-light-mauve transition-transform duration-300 hover:scale-105"
    >
      <div class="p-6">
        <h2 class="text-center text-2xl font-bold text-deep-plum">Mis Citas</h2>
        <p class="text-center text-md text-muted-grape mt-2">
          A continuación podrás administrar tus próximas citas
        </p>
      </div>
    </div>
  </div>

  <div v-if="user.loading" class="flex justify-center items-center mt-20">
    <div class="flex flex-col items-center gap-4">
      <svg
        class="animate-spin h-10 w-10 text-deep-plum"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p class="text-lg text-muted-grape">Cargando citas...</p>
    </div>
  </div>

  <div v-else>
    <div v-if="user.noAppointments" class="flex justify-center mt-10 px-4">
      <div
        class="rounded-xl shadow-2xl p-6 max-w-md w-full border-4 backdrop-blur-sm bg-white/30"
        style="border-color: var(--color-light-mauve)"
      >
        <div class="flex flex-col items-center justify-center text-center">
          <h2 class="text-2xl font-bold text-deep-plum mb-4">
            No tienes próximas citas
          </h2>
          <p class="text-md text-muted-grape mb-4">
            ¡Anímate a agendar tu próxima cita con nosotros!
          </p>
          <button
            @click="bookNewAppointment"
            class="flex items-center px-6 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-white/50 mb-4"
            style="border-color: var(--color-muted-grape); color: var(--color-deep-plum);"
          >
            Agendar Cita
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
          <p class="text-md text-muted-grape mb-4">
            ¿Acabas de agendar una cita? Recarga la página para ver tus citas.
          </p>
          <button
            @click="reloadPage"
            class="flex items-center px-6 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-white/50"
            style="border-color: var(--color-muted-grape); color: var(--color-deep-plum);"
          >
            Recargar Página
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
    </div>
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10 mx-5">
      <Appointment
        v-for="appointment in user.userAppointments"
        :key="appointment._id"
        :appointment="appointment"
      />
      <div
        class="flex items-center justify-center p-6 rounded-xl flex-col gap-6 shadow-lg border border-gray-200 bg-gradient-to-r from-white via-pastel-lilac to-light-mauve transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
      >
        <div class="flex flex-col items-center justify-center text-center">
          <h2 class="text-2xl font-bold text-deep-plum">
        ¿Necesitas una nueva cita?
          </h2>
          <p class="text-md text-muted-grape mt-2 mb-6">
        ¡Anímate a agendar tu próxima cita con nosotros!
          </p>
          <button
        @click="bookNewAppointment"
        class="flex items-center px-6 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-white/50"
        style="border-color: var(--color-muted-grape); color: var(--color-deep-plum);"
          >
        Agendar Cita
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
    </div>
  </div>
</template>

