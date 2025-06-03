import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAlertStore = defineStore('alert', () => {
  const alerts = ref([]) // Change to an array to hold multiple alerts
  let alertIdCounter = 0 // To generate unique IDs for each alert

  /**
   * Displays a new alert.
   * @param {string} message - The message to display in the alert.
   * @param {string} type - The type of alert (e.g., 'success', 'error', 'warning', 'info', 'default').
   * @param {number} duration - How long the alert should be visible in milliseconds. Defaults to 3000.
   */
  function showAlert(message, type = 'default', duration = 3000) {
    const id = alertIdCounter++ // Assign a unique ID
    alerts.value.push({ id, message, type })

    // Automatically dismiss the alert after the specified duration
    setTimeout(() => {
      dismissAlert(id)
    }, duration)
  }

  /**
   * Dismisses a specific alert by its ID.
   * @param {number} id - The ID of the alert to dismiss.
   */
  function dismissAlert(id) {
    alerts.value = alerts.value.filter((alert) => alert.id !== id)
  }

  return {
    alerts, // Expose the alerts array
    showAlert,
    dismissAlert,
  }
})
