<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/helpers/index.js'
import { useAppointmentsStore } from '@/stores/appointments'

const appointments = useAppointmentsStore()
const props = defineProps({
  service: {
    type: Object,
    required: true,
  },
})

const serviceImage = computed(() => {
  if (!props.service || !props.service.name) {
    return '/store.svg'
  }
  const name = props.service.name.toLowerCase()

  if (name.includes('corte') && name.includes('mujeres')) {
    return '/hair_cut_woman.svg'
  } else if (name.includes('masajes')) {
    return '/massage.svg'
  } else if (name.includes('barba') || name.includes('afeitado')) {
    return '/beard.svg'
  } else if (name.includes('corte') && name.includes('niños')) {
    return '/hair_cut_child.svg'
  } else if (name.includes('corte')) {
    return '/hair_cut.svg'
  } else if (name.includes('peinados')) {
    return '/hairdressers.svg'
  } else if (name.includes('cabello')) {
    return '/hair.svg'
  } else if (name.includes('tratamiento')) {
    return '/treatment.svg'
  } else if (name.includes('maquillaje')) {
    return '/makeup.svg'
  } else if (name.includes('manicura') || name.includes('pedicura')) {
    return '/finger_nail.svg'
  }

  return '/store.svg'
})
</script>

<template>
  <div
    class="p-6 rounded-xl flex items-center gap-6 shadow-lg border border-gray-200 bg-gradient-to-r from-white via-pastel-lilac to-light-mauve transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
    :class="appointments.isServiceSelected(service._id) ? 'ring-2 ring-deep-plum' : ''"
  >
    <img
      :src="serviceImage"
      :alt="service.name"
      class="w-20 h-20 object-contain rounded-full border-2 border-muted-grape shadow transition-transform duration-300 hover:scale-110"
    />

    <div class="flex flex-col justify-between h-full w-full">
      <p class="text-xl font-semibold text-deep-plum mb-1">{{ service.name }}</p>

      <div class="flex justify-between items-end mt-2">
        <p class="text-lg font-bold text-muted-grape">
          {{ formatCurrency(service.price) }}
        </p>

        <button
          class="px-4 py-2 text-xs font-bold uppercase transition-all duration-300 rounded-lg focus:outline-none shadow-md transform hover:scale-105"
          :class="
            appointments.isServiceSelected(service._id)
              ? 'bg-deep-plum text-white hover:bg-muted-grape'
              : 'bg-muted-grape text-white hover:bg-deep-plum'
          "
          @click="appointments.onServiceSelected(service)"
        >
          {{ appointments.isServiceSelected(service._id) ? 'Seleccionado' : 'Agendar' }}
        </button>
      </div>
    </div>
  </div>
</template>
