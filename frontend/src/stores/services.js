import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import servicesAPI from '@/api/servicesAPI'

export const userServicesStore = defineStore('services', () => {
  const services = ref([])
  onMounted(async () => {
    try {
      const { data } = await servicesAPI.all()
      services.value = data
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  })
  return {
    services,
  }
})
