<script setup>
import { useAppointmentsStore } from '@/stores/appointments'
import { formatCurrency } from '@/helpers'

const appointments = useAppointmentsStore()
defineProps({
  service: {
    type: Object,
  },
})
</script>
<template>
  <div class="border border-gray-600 bg-gray-100 rounded-lg p-5 flex justify-between items-center">
    <div>
      <p class="text-lg font-bold text-gray-800 md:text-xl">{{ service.name }}</p>
      <p class="text-lg font-bold text-gray-700 md:text-xl">{{ formatCurrency(service.price) }}</p>
    </div>
    <button
      type="button"
      class="block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 cursor-pointer"
      @click="appointments.onServiceSelected(service)"
    >
      Eliminar
    </button>
  </div>
</template>
