// frontend\src\stores\services.js
import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import servicesAPI from '@/api/servicesAPI'

export const userServicesStore = defineStore('services', () => {
  const services = ref([])
  onMounted(async () => {
    try {
      const { data } = await servicesAPI.all()
      // Access data.services because your backend now returns an object with a 'services' key
      services.value = data.services
      console.log(data)
    } catch (error) {
      console.log(error)
    }
    console.log(services)
  })
  return {
    services,
  }
})
