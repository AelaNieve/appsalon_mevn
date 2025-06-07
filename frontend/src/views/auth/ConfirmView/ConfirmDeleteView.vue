<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthAPI from '@/api/AuthAPI'
import { useAlertStore } from '@/stores/useAlertStore'

const route = useRoute()
const router = useRouter()
const alertStore = useAlertStore()

const { token } = route.params
const isLoading = ref(true)
const deletionStatus = ref(null) // 'success' or 'error'
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
    // Note: Your backend expects 'deleteToken', but router provides 'token'.
    // Ensure your AuthAPI call or backend route is consistent.
    const { data } = await AuthAPI.confirmAccountDeletion(token)
    deletionStatus.value = 'success'
    alertStore.showAlert(data.msg, 'success')
    startCountdownAndRedirect('register')
  } catch (error) {
    //console.error('Account deletion failed:', error)
    deletionStatus.value = 'error'
    alertStore.showAlert(error.response?.data?.msg || 'No se pudo borrar la cuenta.', 'error')
    startCountdownAndRedirect('problems')
  } finally {
    isLoading.value = false
  }
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center px-4 space-y-6">
    <div v-if="isLoading">
      <h1 class="text-4xl md:text-5xl font-extrabold text-white">Deleting Account...</h1>
      <p class="text-lg md:text-xl text-gray-300 mt-2">Your request is being processed.</p>
      <div
        class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500 mx-auto mt-6"
      ></div>
    </div>

    <div v-if="deletionStatus === 'success'" class="space-y-4">
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
      <h1 class="text-4xl md:text-5xl font-extrabold text-white">Account Deleted</h1>
      <p class="text-lg md:text-xl text-gray-300">Your account has been permanently removed.</p>
      <p class="text-md text-gray-400">Redirecting in {{ countdown }} seconds...</p>
    </div>

    <div v-if="deletionStatus === 'error'" class="space-y-4">
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
      <h1 class="text-4xl md:text-5xl font-extrabold text-white">Deletion Error</h1>
      <p class="text-lg md:text-xl text-gray-300">
        The deletion link may be invalid or has expired.
      </p>
      <p class="text-md text-gray-400">Redirecting in {{ countdown }} seconds...</p>
    </div>
  </div>
</template>
