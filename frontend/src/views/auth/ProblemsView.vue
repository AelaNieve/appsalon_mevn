<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <div class="space-y-8">
    <div
      v-if="route.name === 'problems'"
      class="bg-white shadow-xl rounded-lg p-8 sm:p-10 space-y-6 text-center"
    >
      <h1 class="text-4xl font-bold text-slate-800">¿Necesitas Ayuda?</h1>
      <p class="text-slate-600">
        Si no puedes verificar tu cuenta, tu cuenta será elimimada directamente, en tal caso crea
        otra cuenta.
      </p>
      <p class="text-slate-600">
        Selecciona una de las siguientes opciones para recuperar el acceso o gestionar tu cuenta.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <RouterLink
          :to="{ name: 'forgot-password' }"
          class="w-full sm:w-auto block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Recuperar Contraseña
        </RouterLink>
        <RouterLink
          :to="{ name: 'request-delete-account' }"
          class="w-full sm:w-auto block text-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Eliminar mi Cuenta
        </RouterLink>
      </div>
    </div>

    <RouterView />

    <nav class="mt-8 flex justify-center">
      <RouterLink
        :to="{ name: 'login' }"
        class="text-slate-300 hover:text-white transition-colors duration-300"
      >
        ¿Ya tienes una cuenta?
      </RouterLink>
    </nav>
  </div>
</template>
