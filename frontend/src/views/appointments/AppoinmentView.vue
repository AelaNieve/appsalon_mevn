<script setup>
import SelectedService from '@/components/SelectedService.vue'
import { formatCurrency } from '@/helpers'
import { useAppointmentsStore } from '@/stores/appointments'

const appointments = useAppointmentsStore()
</script>
<template>
  <div class="flex items-center justify-center mb-5">
    <div class="flex max-w-md overflow-hidden bg-muted-grape rounded-lg shadow-lg">
      <div class="p-4 md:p-4">
        <h1 class="text-center font-bold text-dark-indigo">
          A continuación verifica la información y confirma tu cita
        </h1>
      </div>
    </div>
  </div>

  <section class="bg-deep-plum/80 mb-5">
    <div class="container px-6 lg:py-10 py-0.5 mx-auto">
      <div class="lg:-mx-6 lg:flex lg:items-left">
        <div class="mt-6 lg:w-1/2 lg:mt-0 lg:mx-6">
          <h1
            class="border border-muted-grape bg-pastel-lilac rounded-lg p-5 text-2xl font-bold text-deep-plum capitalize lg:text-3xl mb-5"
          >
            Servicios seleccionados
          </h1>

          <div class="grid gap-5">
            <SelectedService
              v-for="service in appointments.services"
              :key="service._id"
              :service="service"
            />
            <p
              class="ml-auto border border-muted-grape bg-light-mauve rounded-lg text-right text-dark-indigo text-2xl mb-4 px-2 py-1"
            >
              Total a pagar:
              <span class="font-black"> {{ formatCurrency(appointments.totalAmount) }}</span>
            </p>
          </div>
        </div>
        <img
          class="object-cover w-full lg:mx-6 lg:w-1/2 rounded-xl h-72 lg:h-96 mb-6 opacity-80"
          src="/background.jpg"
          alt=""
        />
      </div>
    </div>
  </section>
</template>
