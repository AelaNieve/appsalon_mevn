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
  <div class="p-5 rounded-lg cursor-pointer bg-white flex items-center space-x-4">
    <img :src="serviceImage" :alt="service.name" class="w-16 h-16 object-contain flex-shrink-0" />

    <div class="space-y-1">
      <p class="text-2xl font-light text-gray-900">{{ service.name }}</p>
      <p class="text-4xl font-black text-blue-600">{{ formatCurrency(service.price) }}</p>
    </div>
  </div>
</template>
