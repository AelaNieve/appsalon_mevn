import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAlertStore = defineStore('alert', () => {
  const showAlert = ref(false)
  const alertMessage = ref('')
  const alertType = ref('error') // Can be 'success', 'error', 'warning', etc.
  let alertTimeout = null // To store the timeout ID

  /**
   * Shows a generic alert with a message and type.
   * @param {string} type - The type of alert (e.g., 'success', 'error', 'warning').
   * @param {string} message - The message to display in the alert.
   * @param {number} duration - How long the alert should be visible in milliseconds (default: 4000).
   */
  function displayAlert(type, message, duration = 4000) {
    clearTimeout(alertTimeout) // Clear any existing timeout
    showAlert.value = true
    alertType.value = type
    alertMessage.value = message

    alertTimeout = setTimeout(() => {
      dismissAlert()
    }, duration)
  }

  function dismissAlert() {
    showAlert.value = false
    alertMessage.value = ''
    alertType.value = 'error' // Reset to a default type
    clearTimeout(alertTimeout) // Ensure timeout is cleared
  }

  // Specific alert functions for better semantic use in components/stores
  function showMaxServicesAlertWithMessage(message) {
    displayAlert('warning', message)
  }

  function showWeekendAlertWithMessage(message) {
    displayAlert('error', message)
  }

  // You can add more specific alert functions as needed
  // function showSuccessAlert(message) {
  //   displayAlert('success', message);
  // }
  // function showErrorAlert(message) {
  //   displayAlert('error', message);
  // }

  return {
    showAlert,
    alertMessage,
    alertType,
    displayAlert,
    dismissAlert,
    showMaxServicesAlertWithMessage,
    showWeekendAlertWithMessage,
  }
})
