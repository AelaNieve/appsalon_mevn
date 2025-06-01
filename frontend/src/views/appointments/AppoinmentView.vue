<script setup>
import SelectedService from '@/components/SelectedService.vue'
import { formatCurrency } from '@/helpers'
import { useAppointmentsStore } from '@/stores/appointments'

const appointments = useAppointmentsStore()
</script>
<template>
  <div class="flex items-center justify-center my-10">
    <div
      class="w-full max-w-3xl bg-gradient-to-br from-pastel-lilac via-muted-grape to-deep-plum rounded-2xl shadow-2xl p-8"
    >
      <div class="flex flex-col md:flex-row items-center gap-8">
        <!-- Imagen decorativa -->
        <img
          class="object-cover w-40 h-40 rounded-full border-4 border-white shadow-lg mb-6 md:mb-0"
          src="/background.jpg"
          alt="Decoración"
        />
        <div class="flex-1">
          <h2 class="text-3xl font-extrabold text-white mb-2 text-center md:text-left">
            <span class="inline-block align-middle mr-2">🗓️</span>
            Confirma tu cita
          </h2>
          <p class="text-lg text-white/90 mb-6 text-center md:text-left">
            Revisa los servicios seleccionados y confirma tu cita. ¡Gracias por confiar en nosotros!
          </p>
          <div
            v-if="appointments.noServicesSelected"
            class="bg-white/80 rounded-lg p-4 text-center text-deep-plum font-semibold text-xl"
          >
            No hay servicios seleccionados
          </div>
          <div v-else>
            <div class="space-y-4">
              <SelectedService
                v-for="service in appointments.services"
                :key="service._id"
                :service="service"
                class="bg-white/90 rounded-lg shadow p-4"
              />
            </div>
            <div class="flex justify-end mt-6">
              <div class="bg-deep-plum text-white rounded-lg px-6 py-3 text-xl font-bold shadow-lg">
                Total a pagar:
                <span class="font-black text-2xl ml-2">{{
                  formatCurrency(appointments.totalAmount)
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
