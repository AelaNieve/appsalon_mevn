<script setup>
import { useUserStore } from '../../stores/user.js'
const user = useUserStore()
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
</template>
