import api from '@/lib/axios'

export default {
  /**
   * Registers a new user.
   * @param {Object} userData - The user data for registration (name, email, password).
   * @returns {Promise<Object>} A promise that resolves with the API response data.
   */
  registerUser(userData) {
    return api.post('/auth/register', userData)
  },
}
