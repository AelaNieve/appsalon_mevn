<script setup>
import SelectedService from '@/views/appointments/SelectedService.vue'
import { formatCurrency } from '@/helpers'
import { useAppointmentsStore } from '@/stores/appointments'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const redirectToSelectServices = () => {
  router.push({ name: 'new-appointment' })
}

const appointments = useAppointmentsStore()

// Get today's date in 'YYYY-MM-DD' format for the min attribute
const today = computed(() => {
  const d = new Date()
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
})

// Calculate the date two months from today for the max attribute
const maxDate = computed(() => {
  const d = new Date()
  d.setMonth(d.getMonth() + 2) // Add two months
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
})
</script>

<template>
  <div
    class="flex items-top justify-center min-h-screen bg-gradient-to-br from-pastel-lilac/60 via-muted-grape/40 to-deep-plum/80 py-16 px-4"
  >
    <div
      class="w-full max-w-3xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-0 border border-light-mauve/40 overflow-hidden"
    >
      <!-- Header with image and title -->
      <div
        class="relative flex flex-col md:flex-row items-center gap-10 bg-gradient-to-r from-pastel-lilac/80 via-muted-grape/60 to-deep-plum/80 p-10"
      >
        <div class="relative">
          <img
            class="object-cover w-44 h-44 rounded-full border-8 border-white shadow-2xl ring-4 ring-pastel-lilac/60 transition-transform hover:scale-105"
            src="/background.jpg"
            alt="Decoración"
          />
          <span
            class="absolute -bottom-2 -right-2 bg-deep-plum text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce"
            >Nuevo</span
          >
        </div>
        <div class="flex-1">
          <h2
            class="text-4xl font-black text-deep-plum mb-3 text-center md:text-left flex items-center gap-3 drop-shadow-lg"
          >
            <span class="text-5xl animate-pulse">🗓️</span>
            <span class="bg-pastel-lilac/70 px-4 py-1 rounded-xl shadow text-dark-indigo"
              >Confirma tu cita</span
            >
          </h2>
          <p class="text-lg text-muted-grape mb-6 text-center md:text-left font-medium">
            Revisa los servicios seleccionados y confirma tu cita.<br />
            <span class="text-deep-plum/80 font-semibold">¡Gracias por confiar en nosotros!</span>
          </p>
        </div>
      </div>

      <!-- Main content -->
      <div class="p-8">
        <div
          v-if="appointments.noServicesSelected"
          class="bg-pastel-lilac/80 rounded-xl p-6 text-center text-deep-plum font-semibold text-xl shadow-lg border-2 border-light-mauve/40"
        >
          <span class="inline-flex items-center gap-2 mb-4">
            <svg
              class="w-7 h-7 text-deep-plum animate-pulse"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3"></path>
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
            No hay servicios seleccionados
          </span>
          <div class="flex justify-center">
            <button
              class="w-full md:w-auto bg-gradient-to-r from-pastel-lilac via-muted-grape to-deep-plum p-4 mt-6 rounded-2xl text-white font-extrabold text-lg shadow-xl ring-2 ring-light-mauve/40 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-l focus:outline-none focus:ring-4 focus:ring-pastel-lilac/60 transition-all duration-200 flex items-center justify-center gap-3"
              @click="redirectToSelectServices"
            >
              <svg
                class="w-7 h-7 text-white drop-shadow"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Seleccionar servicios</span>
            </button>
          </div>
        </div>

        <div v-else>
          <div class="space-y-4">
            <SelectedService
              v-for="service in appointments.services"
              :key="service._id"
              :service="service"
              class="bg-white/95 rounded-xl shadow-lg p-5 border border-light-mauve/30 hover:scale-[1.02] transition-transform"
            />
          </div>
          <div class="flex justify-end mt-8">
            <div
              class="bg-gradient-to-r from-deep-plum via-muted-grape to-pastel-lilac text-white rounded-xl px-8 py-4 text-2xl font-bold shadow-lg flex items-center gap-2 ring-2 ring-light-mauve/40"
            >
              <span>Total a pagar:</span>
              <span class="font-black text-3xl text-pastel-lilac drop-shadow-lg">
                {{ formatCurrency(appointments.totalAmount) }}
              </span>
            </div>
          </div>
          <h1
            class="text-3xl font-extrabold text-center my-10 text-deep-plum tracking-tight bg-pastel-lilac/40 rounded-xl py-3 shadow"
          >
            Selecciona una fecha para tu cita
          </h1>
          <div class="mb-8 flex flex-col md:flex-row items-center gap-6">
            <label for="appointment-date" class="block text-deep-plum font-semibold mb-2 md:mb-0">
              Selecciona una fecha:
            </label>
            <input
              id="appointment-date"
              type="date"
              :min="today"
              :max="maxDate"
              v-model="appointments.date"
              class="w-full md:w-1/2 p-3 rounded-lg border-2 border-light-mauve/40 shadow text-deep-plum font-semibold focus:ring-4 focus:ring-pastel-lilac focus:outline-none transition bg-white/90"
            />
          </div>
          <transition-group
            name="fade"
            tag="div"
            v-if="appointments.isDateSelected"
            class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-10"
          >
            <button
              v-for="hour in appointments.hours"
              :key="hour"
              class="rounded-lg text-lg font-bold p-3 transition-all duration-200 border-2 border-light-mauve/30 shadow-sm disabled:bg-red-300 disabled:text-white disabled:cursor-not-allowed hover:scale-105"
              :class="
                appointments.time == hour
                  ? 'bg-gradient-to-r from-deep-plum via-muted-grape to-pastel-lilac text-white ring-2 ring-pastel-lilac'
                  : 'bg-white/90 text-deep-plum hover:bg-pastel-lilac/60 hover:text-deep-plum'
              "
              @click="appointments.time = hour"
              :disabled="appointments.isTimeTaken(hour)"
            >
              {{ hour }}
            </button>
          </transition-group>
        </div>
      </div>
      <div v-if="appointments.isValidReservation" class="mt-6 flex justify-center px-8 pb-8">
        <button
          class="w-full md:w-auto bg-gradient-to-r from-deep-plum via-muted-grape to-dark-indigo p-4 rounded-xl text-white font-extrabold text-lg hover:scale-105 hover:shadow-2xl transition-all tracking-wide shadow-lg ring-2 ring-pastel-lilac/40"
          @click="appointments.createAppointment"
        >
          <span class="inline-flex items-center gap-2">
            <svg
              class="w-6 h-6 text-pastel-lilac"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
            </svg>
            Confirmar reservación
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 2, 0.6, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
