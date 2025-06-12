// frontend\src\stores\user.js
import { ref, onMounted, computed } from 'vue' // Removed onBeforeUnmount
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import AuthAPI from '@/api/AuthAPI'
import AppointmentAPI from '@/api/AppointmentAPI'
import { useAppointmentsStore } from '@/stores/appointments' // Import the appointments store

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const user = ref({})
  const userAppointments = ref([])
  const loading = ref(true)

  let logoutTimer = null // Variable to hold the timer ID

  const AUTO_LOGOUT_TIME = 1 * 60 * 60 * 1000 // 1 hour in milliseconds

  // Function to start the auto-logout timer
  function startAutoLogoutTimer() {
    // Clear any existing timer to prevent multiple timers running
    if (logoutTimer) {
      clearTimeout(logoutTimer)
    }

    logoutTimer = setTimeout(() => {
      console.log('1 hora ha pasado, cerrando sesión de forma automatica...')
      logout() // Call your existing logout function
    }, AUTO_LOGOUT_TIME)
  }

  onMounted(async () => {
    try {
      const { data } = await AuthAPI.auth()
      user.value = data
      startAutoLogoutTimer() // Start the timer when the user is authenticated on mount
      await getUserAppointments(user.value._id)
    } catch (error) {
      console.log(error)
      router.push({ name: 'login' })
    } finally {
      loading.value = false
    }
  })

  async function getUserAppointments(user) {
    const { data } = await AppointmentAPI.getUserAppointments(user)
    console.log('User appointments fetched:', data)
    userAppointments.value = data
  }

  async function logout() {
    try {
      // Make an API call to your backend to clear the cookie
      await AuthAPI.logout() // Assuming you have a logout method in AuthAPI

      user.value = {} // Clear the user data in the store
      userAppointments.value = [] // Clear the user appointments in the store
      const appointmentsStore = useAppointmentsStore()  // Get the appointments store
      appointmentsStore.services = []  // Clear the selected services
      appointmentsStore.date = ''      // Reset the appointment date
      appointmentsStore.time = ''      // Reset the appointment time
      if (logoutTimer) {
        // Clear the timer when manually logging out
        clearTimeout(logoutTimer)
      }
      router.push({ name: 'login' }) // Redirect to the login page
    } catch (error) {
      console.error('Error during logout:', error)
      // Even if there's an error on the backend, clear local state and redirect
      user.value = {}
      userAppointments.value = [] // Clear the user appointments even on error
      const appointmentsStore = useAppointmentsStore()  // Get the appointments store
      appointmentsStore.services = []  // Clear the selected services
      appointmentsStore.date = ''      // Reset the appointment date
      appointmentsStore.time = ''      // Reset the appointment time
      if (logoutTimer) {
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

  const noAppointments = computed(() => userAppointments.value.length == 0)

  // Acción para cargar las citas del usuario
  async function fetchUserAppointments() {
    loading.value = true
    try {
      // Asegúrate de que el usuario ya esté autenticado y obtenido antes
      const { data } = await AppointmentAPI.getUserAppointments(user.value._id)
      userAppointments.value = data
    } catch (error) {
      console.error('Error al cargar las citas:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    logout,
    getUserName,
    startAutoLogoutTimer,
    fetchUser,
    userAppointments,
    noAppointments,
    loading,
    fetchUserAppointments,
  }
})
