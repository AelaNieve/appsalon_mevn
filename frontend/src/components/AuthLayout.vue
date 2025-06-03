<script setup>
import { RouterLink, RouterView } from 'vue-router'
import CustomAlert from '@/views/CustomAlert.vue' // Import the CustomAlert component
import { useAlertStore } from '@/stores/alert' // Import the alert store

const authRoutes = [
  { name: 'register', text: 'Crear una cuenta' },
  { name: 'login', text: 'Ya tienes cuenta? Iniciar sesión' },
]

const alertStore = useAlertStore()
</script>

<template>
  <div class="mx-auto lg:w-4/5 mt-20">
    <h1 class="text-6xl font-extrabold text-white text-center mt-10">AppSalon</h1>
    <RouterView />
    <nav
      class="mt-10 flex flex-col items-center space-y-5 lg:flex-row lg:justify-between lg:space-y-0"
    >
      <RouterLink
        v-for="authRoute in authRoutes"
        :key="authRoute.name"
        :to="{ name: authRoute.name }"
        class="uppercase font-bold text-white"
        >{{ authRoute.text }}</RouterLink
      >
    </nav>

    <CustomAlert
      :visible="alertStore.visible"
      :message="alertStore.message"
      @close="alertStore.dismissAlert"
    />
  </div>
</template>
