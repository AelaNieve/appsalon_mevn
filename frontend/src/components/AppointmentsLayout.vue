<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import CustomAlert from '@/views/CustomAlert.vue'
import { useAlertStore } from '@/stores/useAlertStore'
import { useUserStore } from '../stores/user.js'
import { useRouter } from 'vue-router'

const user = useUserStore()
const menuOpen = ref(false)
const alertStore = useAlertStore()
const router = useRouter()

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}
</script>

<template>
  <header
    class="bg-deep-plum/80 relative shadow-xl backdrop-blur-md sm:backdrop-blur-none border-b border-light-mauve/30"
  >
    <div class="mx-auto flex h-20 max-w-screen-xl items-center gap-8 px-6 sm:px-10 lg:px-16">
      <RouterLink
        :to="{ name: 'my-appointments' }"
        class="block text-pastel-lilac transition hover:text-light-mauve"
      >
        <h1
          class="text-3xl font-black tracking-widest text-pastel-lilac drop-shadow-lg transition hover:text-light-mauve"
          style="letter-spacing: 0.15em"
        >
          AppSalon
        </h1>
      </RouterLink>

      <div class="flex flex-1 items-center justify-end gap-8">
        <p class="text-white font-semibold italic drop-shadow text-left hidden md:block">
          Hola: {{ user.getUserName }}
        </p>
        <div class="flex items-center">
          <button
            @click="toggleMenu"
            class="block rounded-full bg-light-mauve p-3 text-deep-plum shadow-md transition hover:text-dark-indigo hover:bg-muted-grape cursor-pointer border-2 border-light-mauve/40 hover:border-dark-indigo/40"
            aria-label="Toggle menu"
          >
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
  </header>

  <!-- Sidebar Overlay -->
  <div
    v-if="menuOpen"
    @click="toggleMenu"
    class="fixed inset-0 z-30 bg-dark-indigo/40 backdrop-blur-sm sm:backdrop-blur-none"
    aria-hidden="true"
  ></div>

  <!-- Sidebar Menu -->
  <aside
    :class="[
      'fixed top-0 right-0 z-40 h-full w-72 bg-gradient-to-b from-deep-plum to-dark-indigo shadow-2xl transition-transform duration-300 ease-in-out',
      menuOpen ? 'translate-x-0' : 'translate-x-full'
    ]"
    aria-label="Sidebar"
  >
    <div class="flex h-full flex-col overflow-y-auto px-5 py-6">
      <div class="mb-8 flex items-center justify-between">
        <p class="text-lg font-bold text-pastel-lilac">Hola: {{ user.getUserName }}</p>
        <button
          @click="toggleMenu"
          class="rounded-full p-2 text-pastel-lilac transition hover:bg-muted-grape/50 hover:text-white"
          aria-label="Close menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav class="flex flex-1 flex-col justify-between">
        <ul class="flex flex-col gap-6 text-center">
      
      <li v-if="user.isAdmin">
        <button
          @click="router.push({ name: 'admin' })"
          class="block w-full rounded-full bg-light-mauve px-6 py-3 text-base font-semibold text-deep-plum shadow-md transition hover:bg-muted-grape hover:text-dark-indigo"
        >
          Panel de Administración
        </button>
      </li>

    
                              <li>
            <button

              @click="router.push({ name: 'home' })"
              class="block w-full rounded-full bg-light-mauve px-6 py-3 text-base font-semibold text-deep-plum shadow-md transition hover:bg-muted-grape hover:text-dark-indigo"
            >
              Pagina Principal
            </button>
          </li>
          <li>
            <RouterLink
              :to="{ name: 'my-appointments' }"
              @click="toggleMenu"
              class="block w-full rounded-full bg-light-mauve px-6 py-3 text-base font-semibold text-deep-plum shadow-md transition hover:bg-muted-grape hover:text-dark-indigo"
            >
              Mis Citas
            </RouterLink>
          </li>
          <li>
            <RouterLink
              :to="{ name: 'new-appointment' }"
              @click="toggleMenu"
              class="block w-full rounded-full bg-light-mauve px-6 py-3 text-base font-semibold text-deep-plum shadow-md transition hover:bg-muted-grape hover:text-dark-indigo"
            >
              Nueva Cita
            </RouterLink>
          </li>
                    <li>
            <button

              @click="router.push({ name: 'forgot-password' })"
              class="block w-full rounded-full bg-light-mauve px-6 py-3 text-base font-semibold text-deep-plum shadow-md transition hover:bg-muted-grape hover:text-dark-indigo"
            >
              Cambiar Contraseña
            </button>
          </li>
                              <li>
            <button

              @click="router.push({ name: 'request-delete-account' })"
              class="block w-full rounded-full bg-light-mauve px-6 py-3 text-base font-semibold text-deep-plum shadow-md transition hover:bg-muted-grape hover:text-dark-indigo"
            >
              Borrar Cuenta
            </button>
          </li>
        </ul>

        <button
          type="button"
          @click="() => { user.logout(); toggleMenu(); }"
          class="mt-8 w-full rounded-full bg-gradient-to-r from-muted-grape to-light-mauve px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:from-light-mauve hover:to-muted-grape"
        >
          Cerrar Sesión
        </button>
      </nav>
    </div>
  </aside>

  <main>
    <RouterView />
  </main>

  <div class="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex w-full max-w-sm flex-col space-y-3 px-4">
    <CustomAlert
      v-for="alert in alertStore.alerts"
      :key="alert.id"
      :id="alert.id"
      :message="alert.message"
      :type="alert.type"
      @close="alertStore.dismissAlert"
    />
  </div>
</template>