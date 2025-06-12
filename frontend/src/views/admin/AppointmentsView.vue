<script setup>
import { computed, onMounted } from 'vue'
import AdminAppointment from '@/views/admin/AdminAppointment.vue'
import { useUserStore } from '@/stores/user.js'

const user = useUserStore()

// Load appointments every time the component is mounted
onMounted(() => {
    console.log('Fetching user appointments...')
  user.fetchUserAppointments()
})

const sortedAppointments = computed(() => {
  if (!user.userAppointments) return []
  // Create a shallow copy to avoid mutating the original array
  return [...user.userAppointments].sort((a, b) => {
    // The date from the backend is already in UTC, we create a date object
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)

    // We get the hours and minutes from the time string
    const [hoursA, minutesA] = a.time.split(':')
    const [hoursB, minutesB] = b.time.split(':')

    // We set the UTC hours and minutes for an accurate comparison
    dateA.setUTCHours(hoursA, minutesA)
    dateB.setUTCHours(hoursB, minutesB)

    // Sort in ascending order
    return dateA - dateB
  })
})
</script>

<template>
  <div v-if="user.loading" class="flex justify-center items-center mt-20">
    <div class="flex flex-col items-center gap-4">
      <svg
        class="animate-spin h-10 w-10 text-deep-plum"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p class="text-lg text-muted-grape">Cargando citas...</p>
    </div>
  </div>

  <div v-else>
    <div v-if="user.noAppointments" class="flex justify-center mt-10 px-4">
      <div
        class="rounded-xl shadow-2xl p-6 max-w-md w-full border-4 backdrop-blur-sm bg-white/30"
        style="border-color: var(--color-light-mauve)"
      >
        <div class="flex flex-col items-center justify-center text-center">
          <h2 class="text-2xl font-bold text-deep-plum mb-4">
            No hay próximas citas
          </h2>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10 mx-5">
      <AdminAppointment
        v-for="appointment in sortedAppointments"
        :key="appointment._id"
        :appointment="appointment"
      />
    </div>
  </div>
</template>