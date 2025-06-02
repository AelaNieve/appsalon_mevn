<script setup>
import ServiceItem from '../ServiceItem.vue'

import CustomAlert from '../../components/CustomAlert.vue'

import { userServicesStore } from '../../stores/services.js'

import { useAppointmentsStore } from '../../stores/appointments.js'
import { storeToRefs } from 'pinia'

const servicesDisplayStore = userServicesStore()
const appointmentsStore = useAppointmentsStore()

const { showMaxServicesAlert } = storeToRefs(appointmentsStore)

const handleCloseAlert = () => {
  appointmentsStore.dismissMaxServicesAlert()
}
</script>

<template>
  <CustomAlert :visible="showMaxServicesAlert" @close="handleCloseAlert" />

  <div class="flex items-center justify-center mb-5">
    <div 
      class="flex max-w-md overflow-hidden rounded-xl shadow-lg border border-gray-200 bg-gradient-to-r from-white via-pastel-lilac to-light-mauve transition-transform duration-300 hover:scale-105"
    >
      <div class="p-6">
      <h1 class="text-center text-xl font-bold text-deep-plum">
          Agradecemos su preferencia. Por favor, seleccione su servicio.
        </h1>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 m-5">
    <ServiceItem
      v-for="service in servicesDisplayStore.services"
      :key="service._id"
      :service="service"
    />
  </div>
</template>
