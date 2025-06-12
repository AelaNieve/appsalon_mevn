<script setup>
import { RouterLink, RouterView } from 'vue-router'
import CustomAlert from '@/views/CustomAlert.vue'
import { useAlertStore } from '@/stores/useAlertStore'

const authRoutes = [
  { name: 'register', text: 'Crear una cuenta' },
  { name: 'problems', text: '¿Problemas para iniciar sesión?' },
  { name: 'login', text: 'Iniciar sesión' },
]

const alertStore = useAlertStore()
</script>

<template>
  <!-- Main container updated to match the app's theme -->
  <div class="bg-dark-indigo text-pastel-lilac min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-md">
      <!-- Logo styled to match HomeView -->
      <RouterLink :to="{ name: 'home' }" class="flex justify-center mb-12">
        <h1
          class="text-5xl font-black tracking-widest text-pastel-lilac drop-shadow-lg transition hover:text-light-mauve"
          style="letter-spacing: 0.15em"
        >
          AppSalon
        </h1>
      </RouterLink>

      <!-- RouterView will render the specific auth component (Login, Register, etc.) -->
      <div class="mb-10">
        <RouterView />
      </div>

      <!-- Themed navigation links -->
      <nav
        class="flex flex-col items-center space-y-5 lg:flex-row lg:justify-around lg:space-y-0"
      >
        <RouterLink
          v-for="authRoute in authRoutes"
          :key="authRoute.name"
          :to="{ name: authRoute.name }"
          class="text-sm font-semibold uppercase text-muted-grape transition hover:text-light-mauve"
        >
          {{ authRoute.text }}
        </RouterLink>
      </nav>
    </div>

    <!-- Alert component remains for user feedback -->
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