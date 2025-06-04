<script setup>
import { RouterLink, RouterView } from 'vue-router'
import CustomAlert from '@/views/CustomAlert.vue'
import { useAlertStore } from '@/stores/useAlertStore'

const authRoutes = [
  { name: 'register', text: 'Crear una cuenta' },
  { name: 'forgot-password', text: '¿Olvidaste tu contraseña?' },
  { name: 'login', text: 'Iniciar sesión' },
]

const alertStore = useAlertStore()
</script>

<template>
  <div
    class="bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="mx-auto lg:w-3/5 xl:w-2/5">
      <RouterLink :to="{ name: 'login' }" class="flex justify-center mb-12">
        <h1 class="text-5xl sm:text-6xl font-extrabold text-white text-center tracking-tight">
          AppSalon
        </h1>
      </RouterLink>

      <div class="mb-12">
        <RouterView />
      </div>

      <nav
        class="mt-10 flex flex-col items-center space-y-5 lg:flex-row lg:justify-around lg:space-y-0"
      >
        <RouterLink
          v-for="authRoute in authRoutes"
          :key="authRoute.name"
          :to="{ name: authRoute.name }"
          class="uppercase font-bold text-slate-300 hover:text-blue-400 transition-colors duration-200 text-sm"
        >
          {{ authRoute.text }}
        </RouterLink>
      </nav>
    </div>

    <div
      class="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 flex flex-col space-y-3"
    >
      <CustomAlert
        v-for="alert in alertStore.alerts"
        :key="alert.id"
        :id="alert.id"
        :message="alert.message"
        :type="alert.type"
        @close="alertStore.dismissAlert"
      />
    </div>
  </div>
</template>
