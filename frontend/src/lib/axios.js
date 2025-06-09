import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // ✨ IMPORTANT: This tells Axios to send cookies
})

export default api
