// frontend\src\stores\user.js
import { ref, onMounted, computed } from 'vue' // Removed onBeforeUnmount
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import AuthAPI from '@/api/AuthAPI'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const user = ref({})
  let logoutTimer = null // Variable to hold the timer ID

  const AUTO_LOGOUT_TIME = 2 * 60 * 60 * 1000 // 2 hours in milliseconds

  // Function to start the auto-logout timer
  function startAutoLogoutTimer() {
    // Clear any existing timer to prevent multiple timers running
    if (logoutTimer) {
      clearTimeout(logoutTimer)
    }

    logoutTimer = setTimeout(() => {
      console.log('2 horas han pasado, cerrando sesión de forma automatica...')
      logout() // Call your existing logout function
    }, AUTO_LOGOUT_TIME)
  }

  onMounted(async () => {
    try {
      const { data } = await AuthAPI.auth()
      user.value = data
      startAutoLogoutTimer() // Start the timer when the user is authenticated on mount
    } catch (error) {
      console.log(error)
      router.push({ name: 'login' })
    }
  })

  async function logout() {
    try {
      // Make an API call to your backend to clear the cookie
      await AuthAPI.logout() // Assuming you have a logout method in AuthAPI

      user.value = {} // Clear the user data in the store
      if (logoutTimer) {
        // Clear the timer when manually logging out
        clearTimeout(logoutTimer)
      }
      router.push({ name: 'login' }) // Redirect to the login page
    } catch (error) {
      console.error('Error during logout:', error)
      // Handle any errors during logout (e.g., show a notification)
      // Even if there's an error on the backend, you might still want to clear
      // local state and redirect the user for a better UX.
      user.value = {}
      if (logoutTimer) {
        // Clear the timer even if there's an error on logout
        clearTimeout(logoutTimer)
      }
      router.push({ name: 'login' })
    }
  }

  async function fetchUser() {
    try {
      const { data } = await AuthAPI.auth()
      user.value = data
    } catch (error) {
      user.value = {}
      console.log(error)
    }
  }

  const getUserName = computed(() => (user.value?.name ? user.value?.name : ''))

  return {
    user,
    logout,
    getUserName,
    startAutoLogoutTimer,
    fetchUser, // <-- add this
  }
})
