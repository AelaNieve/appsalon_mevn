<script setup>
import SelectedService from '@/components/SelectedService.vue'
import { formatCurrency } from '@/helpers'
import { useAppointmentsStore } from '@/stores/appointments'

const appointments = useAppointmentsStore()
</script>
<template>
  <div class="flex items-center justify-center mb-5">
    <div class="flex max-w-md overflow-hidden bg-white rounded-lg shadow-lg">
      <div class="p-4 md:p-4">
        <h1 class="text-center font-bold text-gray-800">
          A continuación verifica la información y confirma tu cita
        </h1>
      </div>
    </div>
  </div>

  <section class="bg-teal-600/20 mb-5">
    <div class="container px-6 lg:py-10 py-0.5 mx-auto">
      <div class="lg:-mx-6 lg:flex lg:items-left">
        <div class="mt-6 lg:w-1/2 lg:mt-0 lg:mx-6">
          <h1 class="text-2xl font-bold text-gray-800 capitalize lg:text-3xl mb-5">
            Servicios seleccionados
          </h1>

          <div class="grid gap-5">
            <SelectedService
              v-for="service in appointments.services"
              :key="service._id"
              :service="service"
            />
            <p class="text-right text-white text-2xl mb-4">
              Total a pagar:
              <span class="font-black"> {{ formatCurrency(appointments.totalAmount) }}</span>
            </p>
          </div>
        </div>
        <img
          class="object-cover w-full lg:mx-6 lg:w-1/2 rounded-xl h-72 lg:h-96 mb-6"
          src="/background.jpg"
          alt=""
        />
      </div>
    </div>
  </section>
</template>
