<script setup>
import { onMounted, ref } from 'vue'
import { useUserStore } from '../../stores/user.js'
const user = useUserStore()
const errorMsg = ref('')

onMounted(async () => {
  try {
    await user.getUserAppointments()
    errorMsg.value = ''
  } catch (error) {
    errorMsg.value = 'No se pudieron cargar tus citas. Intenta de nuevo más tarde.'
  }
})
</script>

<template>
  <div class="flex items-center justify-center mb-5">
    <div
      class="flex max-w-md overflow-hidden rounded-xl shadow-lg border border-gray-200 bg-gradient-to-r from-white via-pastel-lilac to-light-mauve transition-transform duration-300 hover:scale-105"
    >
      <div class="p-6">
        <h2 class="text-center text-xl font-bold text-deep-plum">Mis Citas</h2>
        <h1 class="text-center text-xl font-bold text-deep-plum">
          A continuación podras administrar tus próximas citas
        </h1>
      </div>
    </div>
  </div>
  <p v-if="user.loading" class="text-white text-2xl text-center mt-5">Cargando...</p>
  <p v-else-if="errorMsg" class="text-red-500 text-2xl text-center mt-5">{{ errorMsg }}</p>
  <div v-else>
    <p v-if="user.noAppointments" class="text-white text-2xl text-center mt-5">
      No tienes próximas citas
    </p>
    <div v-else class="grid grid-cols-1 gap-5 mt-10">
      <Appointment
        v-for="appointment in user.userAppointments"
        :key="appointment._id"
        :appointment="appointment"
      />
    </div>
  </div>
</template>
