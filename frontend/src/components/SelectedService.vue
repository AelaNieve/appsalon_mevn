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
  <div
    class="border border-muted-grape bg-pastel-lilac rounded-lg p-5 flex justify-between items-center"
  >
    <div>
      <p class="text-lg font-bold text-dark-indigo md:text-xl">{{ service.name }}</p>
      <p class="text-lg font-bold text-deep-plum md:text-xl">{{ formatCurrency(service.price) }}</p>
    </div>

    <button
      type="button"
      class="max-w-md block rounded-md bg-deep-plum px-5 py-2.5 text-sm font-medium text-white transition hover:bg-muted-grape cursor-pointer"
      @click="appointments.onServiceSelected(service)"
    >
      Eliminar
    </button>
  </div>
</template>
