<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthAPI from '@/api/AuthAPI'
import { useAlertStore } from '@/stores/useAlertStore'

// Initialize stores and router
const route = useRoute()
const router = useRouter()
const alertStore = useAlertStore()

// Component state
const { token } = route.params
const isLoading = ref(true)
const confirmationStatus = ref(null) // 'success' or 'error'
const countdown = ref(5)
let intervalId = null

/**
 * Starts a countdown and redirects the user to a specified route.
 * @param {string} routeName - The name of the route to redirect to.
 */
const startCountdownAndRedirect = (routeName) => {
  intervalId = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(intervalId)
      router.push({ name: routeName })
    }
  }, 1000)
}

// Lifecycle hooks
onMounted(async () => {
  try {
    const { data } = await AuthAPI.verifyAccount(token)
    confirmationStatus.value = 'success'
    alertStore.showAlert(data.msg, 'success')
    startCountdownAndRedirect('login')
  } catch (error) {
    //console.error('Account confirmation failed:', error)
    confirmationStatus.value = 'error'
    alertStore.showAlert(
      error.response?.data?.msg || 'No se pudo verificar la cuenta.',
      'error',
      10000,
    )
    startCountdownAndRedirect('problems')
  } finally {
    isLoading.value = false
  }
})

onBeforeUnmount(() => {
  // Clear interval if the component is unmounted prematurely
  clearInterval(intervalId)
})
</script>

<template>
  <div class="bg-deep-plum/60 border border-muted-grape/50 rounded-2xl p-8 sm:p-10 shadow-xl backdrop-blur-sm">
    <div class="flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div v-if="isLoading" class="space-y-4">
        <h1 class="text-3xl md:text-4xl font-bold text-pastel-lilac">Confirmando cuenta...</h1>
        <p class="text-lg text-light-mauve/90">Por favor espera mientras verificamos tu cuenta.</p>
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-light-mauve mx-auto mt-6"></div>
      </div>

      <div v-if="confirmationStatus === 'success'" class="space-y-4">
        <svg class="w-20 h-20 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h1 class="text-3xl md:text-4xl font-bold text-pastel-lilac">¡Cuenta Confirmada!</h1>
        <p class="text-lg text-light-mauve/90">Tu cuenta ha sido correctamente verificada.</p>
        <p class="text-md text-muted-grape">Redirigiendo a iniciar sesión en: {{ countdown }} segundos...</p>
      </div>

      <div v-if="confirmationStatus === 'error'" class="space-y-4">
        <svg class="w-20 h-20 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h1 class="text-3xl md:text-4xl font-bold text-pastel-lilac">Error de Confirmación</h1>
        <p class="text-lg text-light-mauve/90">El enlace puede que no exista o sea inválido.</p>
        <p class="text-md text-muted-grape">Redirigiendo a la página de ayuda en: {{ countdown }} segundos...</p>
      </div>
    </div>
  </div>
</template>