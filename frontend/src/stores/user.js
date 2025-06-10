// frontend\src\stores\user.js
import { ref, onMounted, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import AuthAPI from '@/api/AuthAPI'
import AppointmentAPI from '@/api/AppointmentAPI' // <-- Make sure the path is correct

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const user = ref({})
  const userAppointments = ref([])
  const loading = ref(true)
  let logoutTimer = null

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
      await getUserAppointments()
      startAutoLogoutTimer() // Start the timer when the user is authenticated on mount
    } catch (error) {
      console.log(error)
      router.push({ name: 'login' })
    } finally {
      loading.value = false
    }
  })

  async function getUserAppointments() {
    try {
      if (!user.value._id) return
      const { data } = await AppointmentAPI.getUserAppointments(user.value._id)
      userAppointments.value = data
    } catch (error) {
      userAppointments.value = []
      alert('No se pudieron cargar las citas')
      console.log(error)
    }
  }

  async function logout() {
    try {
      // Make an API call to your backend to clear the cookie
      await AuthAPI.logout() // Assuming you have a logout method in AuthAPI

      user.value = {} // Clear the user data in the store
      userAppointments.value = []
      if (logoutTimer) {
        // Clear the timer when manually logging out
        clearTimeout(logoutTimer)
      }
      router.push({ name: 'login' }) // Redirect to the login page
    } catch (error) {
      user.value = {}
      userAppointments.value = []
      if (logoutTimer) {
        // Clear the timer even if there's an error on logout
        clearTimeout(logoutTimer)
      }
      router.push({ name: 'login' })
      console.error('Error during logout:', error)
    }
  }

  async function fetchUser() {
    try {
      const { data } = await AuthAPI.auth()
      user.value = data
      await getUserAppointments()
    } catch (error) {
      user.value = {}
      userAppointments.value = []
      console.log(error)
    }
  }

  const getUserName = computed(() => (user.value?.name ? user.value?.name : ''))
  const noAppointments = computed(() => userAppointments.value.length === 0)

  return {
    user,
    userAppointments,
    loading,
    logout,
    getUserName,
    startAutoLogoutTimer,
    fetchUser,
    getUserAppointments,
    noAppointments,
  }
})
