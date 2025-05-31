<script setup>
import { computed } from 'vue'
import { formatCurrency } from '../helpers'

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
  <div class="p-5 rounded-lg bg-white flex items-center space-x-4">
    <img :src="serviceImage" :alt="service.name" class="w-16 h-16 object-contain flex-shrink-0" />

    <div class="flex flex-col justify-between h-full w-full">
      <p class="text-lg font-bold text-gray-800 md:text-xl">{{ service.name }}</p>

      <div class="flex justify-between items-end mt-2">
        <p class="text-lg font-bold text-gray-700 md:text-xl">
          {{ formatCurrency(service.price) }}
        </p>

        <button
          class="px-2 py-1 text-xs font-bold text-white uppercase transition-colors duration-300 transform bg-teal-600 hover:bg-teal-700 cursor-pointer rounded focus:outline-none focus:bg-teal-700"
        >
          Agendar
        </button>
      </div>
    </div>
  </div>
</template>
