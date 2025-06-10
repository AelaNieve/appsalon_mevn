import api from '@/lib/axios'

export default {
  /**
   * Creates a new appointment.
   * @param {Object} data - The appointment data.
   * @returns {Promise<Object>} A promise that resolves with the API response data.
   */
  create(data) {
    return api.post('/appointments', data)
  },
  getByDate(date) {
    return api.get(`/appointments?date=${date}`)
  },
  getUserAppointments() {
    return api.get('/users/appointments')
  },
  getById(id) {
    return api.get(`/appointments/${id}`)
  },
  update(id, data) {
    return api.put(`/appointments/${id}`, data)
  },
  delete(id) {
    return api.delete(`/appointments/${id}`)
  },
}
