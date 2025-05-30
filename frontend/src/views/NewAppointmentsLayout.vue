<script setup>
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <nav class="w-full py-5 px-5 gap-3">
    <div class="flex space-x-2 rounded-xl bg-teal-600/20 p-1">
      <RouterLink
        :to="{ name: 'new-appointment' }"
        :class="[
          'w-full rounded-lg py-2.5 text-sm font-extrabold uppercase leading-5 text-center',
          'ring-white/60 ring-offset-2 ring-offset-teal-400 focus:outline-none focus:ring-2',
          route.name == 'new-appointment'
            ? 'bg-white text-teal-700 shadow'
            : 'text-teal-100 hover:bg-white/[0.12] hover:text-white',
        ]"
      >
        Servicios
      </RouterLink>

      <RouterLink
        :to="{ name: 'appointment-details' }"
        :class="[
          'w-full rounded-lg py-2.5 text-sm font-extrabold uppercase leading-5 text-center',
          'ring-white/60 ring-offset-2 ring-offset-teal-400 focus:outline-none focus:ring-2',
          route.name == 'appointment-details'
            ? 'bg-white text-teal-700 shadow'
            : 'text-teal-100 hover:bg-white/[0.12] hover:text-white',
        ]"
      >
        Cita y Resumen
      </RouterLink>
    </div>
  </nav>

  <RouterView />
</template>
