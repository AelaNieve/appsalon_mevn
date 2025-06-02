<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const menuOpen = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}
</script>

<template>
  <header class="bg-deep-plum/80 relative shadow-xl backdrop-blur-md border-b border-light-mauve/30">
    <div class="mx-auto flex h-20 max-w-screen-xl items-center gap-8 px-6 sm:px-10 lg:px-16">
      <a class="block text-pastel-lilac transition hover:text-light-mauve" href="#">
        <h1
          class="text-3xl font-black tracking-widest text-pastel-lilac drop-shadow-lg transition hover:text-light-mauve"
          style="letter-spacing: 0.15em;"
        >
          AppSalon
        </h1>
      </a>
      <!-- Saludo al lado del logo -->
      <p class="text-white font-semibold italic drop-shadow text-left hidden md:block">Hola: Usuario</p>

      <div class="flex flex-1 items-center justify-end">
        <nav aria-label="Global" class="hidden md:block">
          <ul class="flex items-center gap-8 text-base">
            <!-- Saludo eliminado de aquí -->
            <li>
              <button
                class="rounded-full bg-light-mauve px-6 py-2 text-base font-semibold text-deep-plum shadow-md transition hover:text-dark-indigo hover:bg-muted-grape cursor-pointer border-2 border-light-mauve/40 hover:border-dark-indigo/40"
              >
                Mis Citas
              </button>
            </li>
            <li>
              <RouterLink
                :to="{ name: 'new-appointment' }"
                class="rounded-full bg-light-mauve px-6 py-2 text-base font-semibold text-deep-plum shadow-md transition hover:text-dark-indigo hover:bg-muted-grape border-2 border-light-mauve/40 hover:border-dark-indigo/40"
              >
                Nueva cita
              </RouterLink>
            </li>
            <li>
              <button
                type="button"
                class="block rounded-full bg-gradient-to-r from-deep-plum via-muted-grape to-light-mauve px-6 py-2 text-base font-semibold text-white shadow-md transition hover:bg-dark-indigo/80 cursor-pointer border-2 border-muted-grape/40 hover:border-dark-indigo/40"
              >
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </nav>

        <div class="flex items-center gap-4 md:hidden">
          <!-- Saludo móvil permanece aquí -->
          <p class="text-white text-right font-semibold italic drop-shadow">Hola: Usuario</p>

          <button
            @click="toggleMenu"
            class="block rounded-full bg-light-mauve p-3 text-deep-plum shadow-md transition hover:text-dark-indigo hover:bg-muted-grape cursor-pointer border-2 border-light-mauve/40 hover:border-dark-indigo/40"
          >
            <span class="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-6"
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
      class="absolute top-20 right-6 w-auto bg-gradient-to-br from-deep-plum via-muted-grape to-light-mauve shadow-2xl py-4 rounded-2xl z-20 border border-light-mauve/30"
    >
      <ul class="flex flex-col items-center gap-5 text-base px-6 pb-2 w-48">
        <li class="w-full">
          <button
            class="cursor-pointer block w-full text-center rounded-full bg-light-mauve px-6 py-2 text-base font-semibold text-deep-plum shadow-md transition hover:text-dark-indigo hover:bg-muted-grape border-2 border-light-mauve/40 hover:border-dark-indigo/40"
          >
            Mis Citas
          </button>
        </li>
        <li class="w-full">
          <RouterLink
            :to="{ name: 'new-appointment' }"
            class="block w-full text-center rounded-full bg-light-mauve px-6 py-2 text-base font-semibold text-deep-plum shadow-md transition hover:text-dark-indigo hover:bg-muted-grape border-2 border-light-mauve/40 hover:border-dark-indigo/40"
          >
            Nueva cita
          </RouterLink>
        </li>
        <li class="w-full">
          <button
            type="button"
            class="block w-full text-center rounded-full px-6 py-2 text-base font-semibold text-white shadow-md transition bg-gradient-to-r from-muted-grape to-dark-indigo hover:from-dark-indigo hover:to-muted-grape cursor-pointer border-2 border-muted-grape/40 hover:border-dark-indigo/40"
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
