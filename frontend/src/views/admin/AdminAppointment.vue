<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/helpers/index.js'


const props = defineProps({
  appointment: {
    type: Object,
  },
})

const displayDate = computed(() => {
  const date = new Date(props.appointment.date)
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }
  return new Intl.DateTimeFormat('es-ES', options).format(date)
})


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
      <p class="text-lg font-bold text-deep-plum">
        <span class="font-extrabold">Nombre Cliente:</span>
        {{ appointment.user.name }}
      </p>
      <p class="text-lg font-bold text-deep-plum">
        <span class="font-extrabold">Email:</span> {{ appointment.user.email }}
      </p>

      <div>
        <p
          class="text-xl font-black text-muted-grape mb-2 border-b border-muted-grape/30 pb-1"
        >
          Servicios
        </p>
        <div class="space-y-2">
          <div
            v-for="service in appointment.services"
            :key="service._id"
            class="flex justify-between items-center"
          >
            <p class="text-deep-plum">{{ service.name }}</p>
            <p class="text-lg font-bold text-muted-grape">
              {{ formatCurrency(service.price) }}
            </p>
          </div>
        </div>
      </div>

      <p
        class="text-2xl font-black text-right text-deep-plum border-t border-muted-grape/50 pt-4 mt-4"
      >
        Total a pagar:
        <span class="font-extrabold text-dark-indigo">
          {{ formatCurrency(appointment.totalAmount) }}
        </span>
      </p>
    </div>
  </div>
</template>