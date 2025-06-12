<script setup>
    import { onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import AppointmentAPI from '../../api/AppointmentAPI';
    import { useAppointmentsStore } from '../../stores/appointments';


    const appointments = useAppointmentsStore()
    const route = useRoute()
    const router = useRouter()

    const { id } = route.params

    onMounted(async () => {
        try {
            appointments.clearAppointmentData()
            const { data } = await AppointmentAPI.getById(id)
            console.log('Fetching appointment with ID:', data)

            appointments.setSelectedAppointment(data)
        } catch (error) {
            //console.error('Error fetching appointment:', error)
            router.push({name: 'my-appointments'})
        }
    })
</script>


<template>
  <nav class="w-full py-5 px-5 gap-3">
    <div class="flex space-x-2 rounded-xl bg-deep-plum/80 p-1">
      <RouterLink
        :to="{ name: 'edit-appointment' }"
        :class="[
          'w-full rounded-lg py-2.5 text-sm font-extrabold uppercase leading-5 text-center',
          'ring-white/60 ring-offset-2 ring-offset-muted-grape focus:outline-none focus:ring-2',
          'transition duration-300 ease-in-out transform',
          route.name == 'edit-appointment'
            ? 'bg-light-mauve text-dark-indigo shadow scale-105'
            : 'text-pastel-lilac hover:bg-white/[0.12] hover:text-white hover:scale-105',
        ]"
      >
        Servicios y Especialidades
      </RouterLink>

      <RouterLink
        :to="{ name: 'edit-appointment-details' }"
        :class="[
          'w-full rounded-lg py-2.5 text-sm font-extrabold uppercase leading-5 text-center',
          'ring-white/60 ring-offset-2 ring-offset-muted-grape focus:outline-none focus:ring-2',
          'transition duration-300 ease-in-out transform',
          route.name == 'edit-appointment-details'
            ? 'bg-light-mauve text-dark-indigo shadow scale-105'
            : 'text-pastel-lilac hover:bg-white/[0.12] hover:text-white hover:scale-105',
        ]"
      >
        Cita y Resumen
      </RouterLink>
    </div>
  </nav>

  <RouterView />
</template>
