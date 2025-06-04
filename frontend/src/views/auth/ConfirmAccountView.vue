<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthAPI from '@/api/AuthAPI'
import { useAlertStore } from '@/stores/useAlertStore'

const route = useRoute()
const router = useRouter()
const alertStore = useAlertStore()

const { token } = route.params

const isLoading = ref(true)
const confirmationStatus = ref(null) // 'success', 'error'
const countdown = ref(5)
let intervalId = null

const startCountdownAndRedirect = (routeName) => {
  intervalId = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(intervalId)
      router.push({ name: routeName })
    }
  }, 1000)
}

onMounted(async () => {
  try {
    const { data } = await AuthAPI.verifyAccount(token)
    confirmationStatus.value = 'success'
    alertStore.showAlert(data.msg, 'success', 5000)
    startCountdownAndRedirect('login')
  } catch (error) {
    console.error('Fallo la confirmación de cuenta:', error)
    confirmationStatus.value = 'error'
    if (error.response && error.response.data && error.response.data.msg) {
      alertStore.showAlert(error.response.data.msg, 'error', 5000)
    } else {
      alertStore.showAlert(
        'Error al confirmar la cuenta. Por favor, inténtalo de nuevo.',
        'error',
        5000,
      )
    }
    startCountdownAndRedirect('register') // Or a dedicated error/retry page
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[calc(100vh-20rem)] text-center px-4">
    <div v-if="isLoading" class="space-y-6">
      <h1 class="text-5xl md:text-6xl font-extrabold text-white">Confirmando Cuenta...</h1>
      <p class="text-xl md:text-2xl text-gray-300">
        Por favor espera mientras verificamos tu información.
      </p>
      <div
        class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"
      ></div>
    </div>

    <div v-if="!isLoading && confirmationStatus === 'success'" class="space-y-6">
      <svg
        class="w-20 h-20 text-green-400 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <h1 class="text-5xl md:text-6xl font-extrabold text-white">¡Cuenta Confirmada!</h1>
      <p class="text-xl md:text-2xl text-gray-300">Tu cuenta ha sido verificada exitosamente.</p>
      <p class="text-lg text-gray-400">
        Serás redirigido al inicio de sesión en {{ countdown }} segundos...
      </p>
    </div>

    <div v-if="!isLoading && confirmationStatus === 'error'" class="space-y-6">
      <svg
        class="w-20 h-20 text-red-400 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <h1 class="text-5xl md:text-6xl font-extrabold text-white">Error de Confirmación</h1>
      <p class="text-xl md:text-2xl text-gray-300">
        No pudimos verificar tu cuenta. Es posible que el enlace haya expirado o sea inválido.
      </p>
      <p class="text-lg text-gray-400">
        Serás redirigido a la página de registro en {{ countdown }} segundos...
      </p>
      <RouterLink
        :to="{ name: 'register' }"
        class="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out"
      >
        Ir a Registro Ahora
      </RouterLink>
    </div>
  </div>
</template>
