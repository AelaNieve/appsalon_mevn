import api from '@/lib/axios'

export default {
  /**
   * Creates a new appointment.
   * @param {Object} data - The appointment data.
   * @returns {Promise<Object>} A promise that resolves with the API response data.
   */
  create(data) {
    // The 'api' instance from '@/lib/axios' is already configured
    // to send the HttpOnly cookie (which contains the AUTH_TOKEN) automatically.
    // Therefore, you do NOT need to manually retrieve the token from localStorage
    // and add it to the Authorization header.
    // This is exactly how AuthAPI.js's 'auth()' method works.
    return api.post('/appointments', data)
  },
}
