// frontend\src\api\AuthAPI.js

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

  /**
   * Verifies a user's account using a token.
   * @param {string} token - The verification token received via email.
   * @returns {Promise<Object>} A promise that resolves with the API response data.
   */
  verifyAccount(token) {
    return api.get(`/auth/verify/${token}`)
  },

  /**
   * Logs in a user.
   * @param {Object} credentials - The user's login credentials (email, password).
   * @returns {Promise<Object>} A promise that resolves with the API response data.
   */
  login(credentials) {
    return api.post('/auth/login', credentials)
  },

  /**
   * Requests account deletion, sending a confirmation email to the user.
   * @returns {Promise<Object>} A promise that resolves with the API response data.
   */
  requestAccountDeletion(emailData) {
    return api.post('/auth/request-delete-account', emailData)
  },

  /**
   * Confirms and executes account deletion using a token from the email.
   * @param {string} deleteToken - The deletion token received via email.
   * @returns {Promise<Object>} A promise that resolves with the API response data.
   */
  confirmAccountDeletion(deleteToken) {
    return api.delete(`/auth/confirm-delete-account/${deleteToken}`)
  },

  /**
   * Requests a password reset email to be sent to the user.
   * @param {Object} emailData - An object containing the user's email ({ email: 'user@example.com' }).
   * @returns {Promise<Object>} A promise that resolves with the API response data.
   */
  forgotPassword(emailData) {
    return api.post('/auth/forgot-password', emailData)
  },

  /**
   * Resets the user's password using a token and new password.
   * @param {string} token - The password reset token from the URL.
   * @param {string} password - The new password.
   * @param {string} password_confirmation - The confirmed new password.
   * @returns {Promise<Object>} A promise that resolves with the API response data.
   */
  resetPassword({ token, password }) {
    // We use a POST request as it's more appropriate for sending credentials.
    return api.post(`/auth/reset-password/${token}`, { password })
  },
}
