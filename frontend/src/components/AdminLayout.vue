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
        <div
            class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between px-6 py-3 sm:h-20 sm:flex-nowrap sm:py-0 sm:px-10 lg:px-16"
        >
            <!-- AppSalon Link -->
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

            <!-- Centered Panel Title - Now responsive -->
            <div class="order-3 w-full text-center sm:order-2 sm:w-auto">
                <h1
                    class="text-xl font-black tracking-widest text-pastel-lilac drop-shadow-lg sm:text-2xl"
                >
                    Panel de Administración
                </h1>
            </div>

            <!-- Right-side content -->
            <div class="order-2 flex items-center gap-8 sm:order-3">
                <p class="hidden text-left font-semibold italic text-white drop-shadow md:block">
                    Hola Admin: {{ user.getUserName }}
                </p>
                <div class="flex items-center">
                    <button
                        @click="toggleMenu"
                        class="block cursor-pointer rounded-full border-2 border-light-mauve/40 bg-light-mauve p-3 text-deep-plum shadow-md transition hover:border-dark-indigo/40 hover:bg-muted-grape hover:text-dark-indigo"
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
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
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
                            :to="{ name: 'crm-dashboard' }"
                            @click="toggleMenu"
                            class="block w-full rounded-full bg-light-mauve px-6 py-3 text-base font-semibold text-deep-plum shadow-md transition hover:bg-muted-grape hover:text-dark-indigo"
                        >
                            CRM Dashboard
                        </RouterLink>
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
