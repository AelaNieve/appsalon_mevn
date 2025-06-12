<script setup>
import { computed } from 'vue'
import { formatCurrency } from '../../helpers'
import { useAppointmentsStore } from '../../stores/appointments'

const appointmentStore = useAppointmentsStore()

// Props
const reloadPage = () => {
  window.location.reload()
}

const props = defineProps({
  appointment: {
    type: Object,
    required: true,
  },
})


// Computed property for a more readable date format
const displayDate = computed(() => {
  // Assuming appointment.date is in a format that the Date constructor can parse
  const date = new Date(props.appointment.date)
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }
  // Using toLocaleDateString for better formatting, e.g., "lunes, 10 de junio de 2025"
  return new Intl.DateTimeFormat('es-ES', options).format(date)
})


/**
 * Handles the cancellation of an appointment.
 * Shows a confirmation dialog before proceeding.
 * On success, it shows an alert and refreshes the appointment list.
 */

const handleCancel = async (id) => {
  if (confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
    try {
      //console.log('Cancelando cita con ID:', id)
      await appointmentStore.deleteAppointment(id) // Assumes this API method exists
      // Refresh the user's appointments list after cancellation
      //await new Promise(resolve => setTimeout(resolve, 5000))
      //reloadPage()
      return
    } catch (error) {
      //reloadPage()
      console.error('Error al cancelar la cita:', error)
    }
  }
}
</script>

<template>
  <div
    class="p-6 rounded-xl flex flex-col gap-6 shadow-lg border border-gray-200 bg-gradient-to-r from-white via-pastel-lilac to-light-mauve transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
  >
    <div class="flex-grow space-y-4">
      <p class="text-lg font-bold text-deep-plum">
        <span class="font-extrabold">Fecha:</span> {{ displayDate }}
      </p>
      <p class="text-lg font-bold text-deep-plum">
        <span class="font-extrabold">Hora:</span> {{ appointment.time }}
      </p>

      <div>
        <p class="text-xl font-black text-muted-grape mb-2 border-b border-muted-grape/30 pb-1">
          Servicios
        </p>
        <div class="space-y-2">
          <div
            v-for="service in appointment.services"
            :key="service._id"
            class="flex justify-between items-center"
          >
            <p class="text-deep-plum">{{ service.name }}</p>
            <p class="text-lg font-bold text-muted-grape">{{ formatCurrency(service.price) }}</p>
          </div>
        </div>
      </div>

      <p class="text-2xl font-black text-right text-deep-plum border-t border-muted-grape/50 pt-4 mt-4">
        Total a pagar:
        <span class="font-extrabold text-dark-indigo">
          {{ formatCurrency(appointment.totalAmount) }}
        </span>
      </p>
    </div>

    <div class="flex flex-col md:flex-row gap-3 mt-auto">
        <RouterLink
          :to="{ name: 'edit-appointment', params: { id: appointment._id } }"
          class="w-full text-center px-4 py-3 text-sm font-bold uppercase transition-all duration-300 rounded-lg focus:outline-none shadow-md transform hover:scale-105 bg-muted-grape text-white hover:bg-deep-plum"
        >
          Editar Cita
        </RouterLink>
        <button
          @click="handleCancel(appointment._id)"
          class="w-full px-4 py-3 text-sm font-bold uppercase transition-all duration-300 rounded-lg focus:outline-none shadow-md transform hover:scale-105 bg-red-600 text-white hover:bg-red-700"
        >
          Cancelar Cita
        </button>
    </div>
  </div>
</template>