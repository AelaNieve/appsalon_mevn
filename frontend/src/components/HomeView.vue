<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const user = useUserStore()
const router = useRouter()
const menuOpen = ref(false)

// Replicates menu functionality from AppointmentsLayout for logged-in users
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

// Handles the main call-to-action button click
const handleCTA = () => {
  if (user.getUserName) {
    router.push({ name: 'new-appointment' })
  } else {
    router.push({ name: 'login' })
  }
}
</script>

<template>
  <!-- Main container with a background that fits the theme -->
  <div class="bg-dark-indigo text-pastel-lilac min-h-screen">
    <!-- HEADER -->
    <header
      class="bg-deep-plum/80 sticky top-0 z-50 shadow-xl backdrop-blur-md border-b border-light-mauve/30"
    >
      <div
        class="mx-auto flex h-20 max-w-screen-2xl items-center justify-between gap-8 px-6 sm:px-10 lg:px-16"
      >
        <!-- Logo/Brand Name -->
        <RouterLink
          :to="{ name: 'home' }"
          class="block text-pastel-lilac transition hover:text-light-mauve"
        >
          <h1
            class="text-3xl font-black tracking-widest text-pastel-lilac drop-shadow-lg transition hover:text-light-mauve"
            style="letter-spacing: 0.15em"
          >
            AppSalon
          </h1>
        </RouterLink>

        <!-- Conditional Header Section: Waits for user auth check to complete -->
        <div v-if="!user.loading" class="flex items-center gap-4">
          <!-- Logged-in User View -->
          <div v-if="user.getUserName" class="flex flex-1 items-center justify-end gap-8">
            <p class="hidden text-left font-semibold italic text-white drop-shadow md:block">
              Hola: {{ user.getUserName }}
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
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Logged-out User View -->
          <div v-else class="flex items-center gap-4">
            <RouterLink
              :to="{ name: 'login' }"
              class="rounded-lg bg-light-mauve px-5 py-2.5 text-sm font-semibold text-deep-plum shadow-md transition hover:bg-muted-grape hover:text-dark-indigo"
            >
              Iniciar Sesión
            </RouterLink>
            <RouterLink
              :to="{ name: 'register' }"
              class="hidden rounded-lg border border-light-mauve bg-transparent px-5 py-2.5 text-sm font-semibold text-pastel-lilac shadow-md transition hover:bg-light-mauve hover:text-deep-plum sm:block"
            >
              Crear Cuenta
            </RouterLink>
          </div>
        </div>
      </div>
    </header>

    <!-- SIDEBAR (for logged-in users, copied from AppointmentsLayout) -->
    <div v-if="user.getUserName">
      <div
        v-if="menuOpen"
        @click="toggleMenu"
        class="fixed inset-0 z-30 bg-dark-indigo/40 backdrop-blur-sm sm:backdrop-blur-none"
        aria-hidden="true"
      ></div>
      <aside
        :class="[
          'fixed top-0 right-0 z-40 h-full w-72 bg-gradient-to-b from-deep-plum to-dark-indigo shadow-2xl transition-transform duration-300 ease-in-out',
          menuOpen ? 'translate-x-0' : 'translate-x-full',
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
                  @click="
                    () => {
                      router.push({ name: 'forgot-password' })
                      toggleMenu()
                    }
                  "
                  class="block w-full rounded-full bg-light-mauve px-6 py-3 text-base font-semibold text-deep-plum shadow-md transition hover:bg-muted-grape hover:text-dark-indigo"
                >
                  Cambiar Contraseña
                </button>
              </li>
              <li>
                <button
                  @click="
                    () => {
                      router.push({ name: 'request-delete-account' })
                      toggleMenu()
                    }
                  "
                  class="block w-full rounded-full bg-light-mauve px-6 py-3 text-base font-semibold text-deep-plum shadow-md transition hover:bg-muted-grape hover:text-dark-indigo"
                >
                  Borrar Cuenta
                </button>
              </li>
            </ul>
            <button
              type="button"
              @click="
                () => {
                  user.logout()
                  toggleMenu()
                }
              "
              class="mt-8 w-full rounded-full bg-gradient-to-r from-muted-grape to-light-mauve px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:from-light-mauve hover:to-muted-grape"
            >
              Cerrar Sesión
            </button>
          </nav>
        </div>
      </aside>
    </div>

    <!-- MAIN CONTENT -->
    <main>
      <!-- Hero Section -->
      <section
        class="relative overflow-hidden bg-gradient-to-br from-dark-indigo via-deep-plum to-muted-grape py-20 text-center text-white md:py-32"
      >
        <div
          class="absolute inset-0 bg-cover bg-center opacity-10"
          style="background-image: url('/background.jpg')"
        ></div>
        <div class="container relative z-10 mx-auto px-6">
          <h2
            class="animate-fade-in-down text-4xl font-black text-pastel-lilac drop-shadow-lg md:text-6xl"
            style="letter-spacing: 0.05em"
          >
            Tu Belleza, Nuestra Pasión
          </h2>
          <p class="animate-fade-in-up mx-auto mt-6 max-w-3xl text-lg text-light-mauve/90 md:text-xl">
            En AppSalon, nos dedicamos a realzar tu belleza natural con servicios de alta calidad y un
            trato excepcional. Vive una experiencia de relajación y estilo única.
          </p>
          <div class="mt-10">
            <button
              @click="handleCTA"
              class="transform rounded-full bg-gradient-to-r from-light-mauve to-pastel-lilac py-4 px-10 text-lg font-bold text-deep-plum shadow-2xl transition-transform duration-300 hover:scale-105"
            >
              {{ user.getUserName ? 'Agendar Nueva Cita' : 'Agenda tu Cita Ahora' }}
            </button>
          </div>
        </div>
      </section>

      <!-- Services Section -->
      <section class="bg-dark-indigo/50 py-20">
        <div class="container mx-auto px-6 text-center">
          <h3 class="mb-4 text-3xl font-bold text-pastel-lilac">Nuestros Servicios</h3>
          <div class="mx-auto mb-12 h-1 w-24 bg-light-mauve"></div>
          <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <!-- Service Card 1 -->
            <div
              class="transform rounded-xl border border-muted-grape/50 bg-deep-plum/60 p-8 shadow-lg transition-transform duration-300 hover:-translate-y-2"
            >
              <div class="mb-4 text-light-mauve">
                <svg
                  class="mx-auto h-16 w-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14.121 14.121L19 19m-7-7l-.879.879A2 2 0 0110.121 14H6a2 2 0 01-2-2V6a2 2 0 012-2h4.121a2 2 0 011.414.586l.879.879M14.121 14.121L19 19m-7-7l7-7"
                  ></path>
                </svg>
              </div>
              <h4 class="mb-2 text-xl font-bold text-pastel-lilac">Cortes y Peinados</h4>
              <p class="text-light-mauve/80">
                Estilos modernos y clásicos para damas, caballeros y niños. Renueva tu look con
                nuestros expertos.
              </p>
            </div>
            <!-- Service Card 2 -->
            <div
              class="transform rounded-xl border border-muted-grape/50 bg-deep-plum/60 p-8 shadow-lg transition-transform duration-300 hover:-translate-y-2"
            >
              <div class="mb-4 text-light-mauve">
                <svg
                  class="mx-auto h-16 w-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  ></path>
                </svg>
              </div>
              <h4 class="mb-2 text-xl font-bold text-pastel-lilac">Coloración y Tratamientos</h4>
              <p class="text-light-mauve/80">
                Dale vida y color a tu cabello con productos de primera y tratamientos que lo nutren
                y fortalecen.
              </p>
            </div>
            <!-- Service Card 3 -->
            <div
              class="transform rounded-xl border border-muted-grape/50 bg-deep-plum/60 p-8 shadow-lg transition-transform duration-300 hover:-translate-y-2"
            >
              <div class="mb-4 text-light-mauve">
                <svg
                  class="mx-auto h-16 w-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.879 16.121A3 3 0 1014.12 11.88l-4.242 4.242z"
                  ></path>
                </svg>
              </div>
              <h4 class="mb-2 text-xl font-bold text-pastel-lilac">Manicura y Pedicura</h4>
              <p class="text-light-mauve/80">
                Luce manos y pies impecables. Ofrecemos desde el esmaltado clásico hasta diseños
                artísticos.
              </p>
            </div>
            <!-- Service Card 4 -->
            <div
              class="transform rounded-xl border border-muted-grape/50 bg-deep-plum/60 p-8 shadow-lg transition-transform duration-300 hover:-translate-y-2"
            >
              <div class="mb-4 text-light-mauve">
                <svg
                  class="mx-auto h-16 w-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
              <h4 class="mb-2 text-xl font-bold text-pastel-lilac">Maquillaje Profesional</h4>
              <p class="text-light-mauve/80">
                Ideal para eventos especiales o simplemente para sentirte radiante. Utilizamos las
                mejores marcas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- About Us Section -->
      <section class="bg-dark-indigo py-20">
        <div class="container mx-auto px-6">
          <div class="flex flex-col items-center gap-12 md:flex-row">
            <div class="md:w-1/2">
              <img
                src="/background.jpg"
                alt="Interior del salón de belleza"
                class="h-auto w-full rounded-2xl border-4 border-muted-grape/40 object-cover shadow-2xl"
              />
            </div>
            <div class="text-center md:w-1/2 md:text-left">
              <h3 class="mb-4 text-3xl font-bold text-pastel-lilac">Sobre Nosotros</h3>
              <p class="mb-4 leading-relaxed text-light-mauve/90">
                Fundado con la misión de ofrecer un refugio de belleza y bienestar, AppSalon es más
                que un simple salón. Es un espacio donde la técnica, el arte y la atención
                personalizada se unen para crear una experiencia inolvidable.
              </p>
              <p class="leading-relaxed text-light-mauve/90">
                Nuestro equipo de estilistas y especialistas está en constante formación para
                traerte las últimas tendencias y las técnicas más avanzadas, siempre utilizando
                productos que cuidan de ti y del medio ambiente.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- FOOTER -->
    <footer class="border-t border-muted-grape/30 bg-deep-plum py-8">
      <div class="container mx-auto px-6 text-center text-light-mauve">
        <p>© {{ new Date().getFullYear() }} AppSalon. Todos los derechos reservados.</p>
        <p class="mt-2 text-sm">Diseñado con ❤️ para tu belleza.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Adding simple animations for a more dynamic feel */
@keyframes fade-in-down {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fade-in-down 0.8s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out 0.3s forwards;
  opacity: 0; /* Start hidden */
}
</style>














<!--<script setup>
//import { onMounted } from 'vue'
//import { useAlertStore } from '@/stores/useAlertStore'
//import CustomAlert from '@/views/CustomAlert.vue'
//
//const alertStore = useAlertStore()
//
//// Define an array of alert configurations to test
//const testAlerts = [
//  { message: 'Alerta de exito!', type: 'success', duration: 4000 },
//  { message: 'Alerta de error!', type: 'error', duration: 5000 },
//  { message: 'Alerta de advertencia!', type: 'warning', duration: 6000 },
//  { message: 'Alerta de información.', type: 'info', duration: 3000 },
//  { message: 'Alerta default.', type: 'default', duration: 3500 },
//];
//
//onMounted(() => {
//  let delay = 0
//  testAlerts.forEach((alert, index) => {
//    // Show alerts sequentially with a delay
//    setTimeout(() => {
//      alertStore.showAlert(alert.message, alert.type, alert.duration)
//    }, delay)
//    // Increase delay for the next alert
//    delay += 1000 // Each alert will appear 1 second after the previous one
//  })
//})
</script>


<template>
  <div
    class="flex flex-col items-center justify-center min-h-[200px] bg-pastel-lilac rounded-lg shadow-md p-8"
  >
    <h1 class="text-3xl font-bold text-dark-indigo mb-2">Hello, Tailwind!</h1>
    <p class="text-muted-grape text-lg">
      This is a <span class="font-semibold text-deep-plum">badly formatted</span> HelloWorld
      component.
    </p>
  </div>
  <button
    @click="alertStore.showAlert('Alerta de exito desde boton.', 'success')"
    class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
  >
    Mostrar alerta de información
  </button>

  <div class="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col space-y-3">
    <CustomAlert
      v-for="alert in alertStore.alerts"
      :key="alert.id"
      :id="alert.id"
      :message="alert.message"
      :type="alert.type"
      @close="alertStore.dismissAlert(alert.id)"
    />
  </div>
</template>

-->
