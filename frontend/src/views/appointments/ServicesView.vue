<script setup>
import ServiceItem from '../ServiceItem.vue'
import { userServicesStore } from '../../stores/services.js'
const store = userServicesStore()
</script>
<template>
  <div class="flex items-center justify-center">
    <div class="flex max-w-md overflow-hidden bg-white rounded-lg shadow-lg">
      <div class="p-4 md:p-4">
        <h1 class="text-center font-bold text-gray-800">
          A continuación elige al menos un servicio para tu cita
        </h1>
      </div>
    </div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 m-5">
    <ServiceItem v-for="service in store.services" :key="service._id" :service="service" />
  </div>
</template>
