<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const menuOpen = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}
</script>

<template>
  <header class="bg-white relative">
    <div class="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
      <a class="block text-teal-600 transition hover:text-cyan-600/75" href="#">
        <h1
          class="text-2xl font-extrabold tracking-tight text-teal-600 transition hover:text-cyan-600/75"
        >
          AppSalon
        </h1>
      </a>

      <div class="flex flex-1 items-center justify-end">
        <nav aria-label="Global" class="hidden md:block">
          <ul class="flex items-center gap-6 text-sm">
            <li class="hidden md:block">
              <p class="text-black">Hola: Usuario</p>
            </li>
            <li>
              <button
                class="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 transition hover:text-teal-600/75 cursor-pointer"
              >
                Mis Citas
              </button>
            </li>
            <li>
              <RouterLink
                :to="{ name: 'new-appointment' }"
                class="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 transition hover:text-teal-600/75"
              >
                Nueva cita
              </RouterLink>
            </li>
            <li>
              <button
                type="button"
                class="block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 cursor-pointer"
              >
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </nav>

        <div class="flex items-center gap-4 md:hidden">
          <p class="text-black text-right">Hola: Usuario</p>

          <button
            @click="toggleMenu"
            class="block rounded-sm bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 cursor-pointer"
          >
            <span class="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <nav
      v-if="menuOpen"
      aria-label="Mobile Global"
      class="absolute top-16 right-4 w-auto bg-white shadow-lg py-2 rounded-md z-10"
    >
      <ul class="flex flex-col items-center gap-4 text-sm px-4 pb-2 w-40">
        <li class="w-full">
          <button
            class="cursor-pointer block w-full text-center rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 transition hover:text-teal-600/75"
          >
            Mis Citas
          </button>
        </li>
        <li class="w-full">
          <RouterLink
            :to="{ name: 'new-appointment' }"
            class="block w-full text-center rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 transition hover:text-teal-600/75"
          >
            Nueva cita
          </RouterLink>
        </li>
        <li class="w-full">
          <button
            type="button"
            class="block w-full text-center rounded-md px-5 py-2.5 text-sm font-medium text-white transition bg-teal-600 hover:bg-teal-700 cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>
