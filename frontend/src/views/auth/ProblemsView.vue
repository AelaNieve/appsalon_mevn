<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <div class="space-y-8">
    <div
      v-if="route.name === 'problems'"
      class="bg-deep-plum/60 border border-muted-grape/50 rounded-2xl p-8 sm:p-10 shadow-xl backdrop-blur-sm space-y-6 text-center"
    >
      <h1 class="text-4xl font-bold text-pastel-lilac">¿Necesitas Ayuda?</h1>
      <p class="text-light-mauve/90">Selecciona una de las siguientes opciones para recuperar el acceso o gestionar tu cuenta.</p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <RouterLink
          :to="{ name: 'forgot-password' }"
          class="w-full sm:w-auto block text-center bg-light-mauve hover:bg-muted-grape text-deep-plum font-bold py-3 px-6 rounded-full transition-colors shadow-md"
        >
          Recuperar Contraseña
        </RouterLink>
        <RouterLink
          :to="{ name: 'request-delete-account' }"
          class="w-full sm:w-auto block text-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-colors shadow-md"
        >
          Eliminar mi Cuenta
        </RouterLink>
      </div>
    </div>

    <RouterView />

    <nav v-if="route.name !== 'problems'" class="mt-8 flex justify-center">
      <RouterLink
        :to="{ name: 'home' }"
        class="font-semibold text-muted-grape hover:text-light-mauve transition-colors duration-300"
      >
        ← Volver a la Pagina Principal
      </RouterLink>
    </nav>
  </div>
</template>