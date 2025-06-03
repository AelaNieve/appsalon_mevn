<script setup>
const authRoutes = [
  { name: 'register', text: 'Crear una cuenta' },
  { name: 'login', text: 'Ya tienes cuenta? Iniciar sesión' },
]
</script>

<template>
  <div class="mx-auto lg:w-4/5 mt-20">
    <h1>Desde Auth Layout</h1>
    <RouterView />
    <nav
      class="mt-10 flex flex-col items-center space-y-5 lg:flex-row lg:justify-between lg:space-y-0"
    >
      <RouterLink
        v-for="authRoute in authRoutes"
        :key="authRoute.name"
        :to="{ name: authRoute.name }"
        class="uppercase font-bold text-black"
        >{{ authRoute.text }}</RouterLink
      >
    </nav>
  </div>
</template>
