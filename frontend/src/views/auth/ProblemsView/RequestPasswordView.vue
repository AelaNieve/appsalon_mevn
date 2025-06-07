<script setup>
import { useForm, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

import AuthAPI from '@/api/AuthAPI'
import { useAlertStore } from '@/stores/useAlertStore'

const alertStore = useAlertStore()

const schema = yup.object({
  email: yup.string().email('Email no válido').required('El email es obligatorio'),
})

const {
  handleSubmit,
  isSubmitting,
  errors: formErrors,
} = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
  },
})

const onSubmit = handleSubmit(async (values) => {
  try {
    const { data } = await AuthAPI.forgotPassword({
      email: values.email,
    })
    alertStore.showAlert(data.msg, 'success', 15000)
  } catch (error) {
    console.error('Password reset request failed:', error)
    const message =
      error?.response?.data?.msg || 'No se pudo procesar tu solicitud. Inténtalo más tarde.'
    alertStore.showAlert(message, 'error')
  }
})

// Helper for dynamic input classes
const inputClass = (fieldName) => [
  'block w-full rounded-md shadow-sm sm:text-sm p-3.5 border',
  formErrors.value[fieldName]
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
]
</script>

<template>
  <div class="space-y-4 mb-8 text-center">
    <h1 class="text-4xl sm:text-5xl font-extrabold text-white">¿Olvidaste tu Contraseña?</h1>
    <p class="text-lg text-slate-300">
      Ingresa tu email y te enviaremos las instrucciones para recuperarla.
    </p>
  </div>

  <div class="bg-white shadow-xl rounded-lg p-8 sm:p-10">
    <form @submit="onSubmit" class="space-y-6">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <Field
          name="email"
          id="email"
          type="email"
          :class="inputClass('email')"
          placeholder="tu@email.com"
        />
        <ErrorMessage name="email" class="mt-1.5 text-xs text-red-600" />
      </div>

      <div class="flex flex-col items-center gap-4">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-opacity duration-150"
          :class="{ 'opacity-70 cursor-not-allowed': isSubmitting }"
        >
          <svg
            v-if="isSubmitting"
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{{ isSubmitting ? 'Enviando...' : 'Enviar Instrucciones' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>
