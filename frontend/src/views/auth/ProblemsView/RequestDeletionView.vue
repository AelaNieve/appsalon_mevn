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
    const { data } = await AuthAPI.requestAccountDeletion({
      email: values.email,
    })
    alertStore.showAlert(data.msg, 'success', 15000)
  } catch (error) {
    console.error('Account deletion request failed:', error)
    const message =
      error?.response?.data?.msg || 'No se pudo procesar tu solicitud. Inténtalo más tarde.'
    alertStore.showAlert(message, 'error')
  }
})

// Helper for dynamic input classes - updated to match RequestPasswordView
const inputClass = (fieldName) => [
  'block w-full rounded-lg p-3.5 border-2 bg-dark-indigo/50 text-pastel-lilac placeholder:text-muted-grape transition',
  formErrors.value[fieldName]
    ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500'
    : 'border-muted-grape/50 focus:border-light-mauve focus:ring-light-mauve',
]
</script>

<template>
  <div class="space-y-2 mb-8 text-center">
    <h1 class="text-4xl font-bold text-pastel-lilac">Eliminar Tu Cuenta</h1>
    <p class="text-lg text-light-mauve/90">
      Ingresa tu email para recibir un enlace de confirmación para eliminar tu cuenta
      permanentemente.
    </p>
  </div>

  <div class="bg-deep-plum/60 border border-muted-grape/50 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
    <form @submit="onSubmit" class="space-y-6">
      <div>
        <label for="email" class="block text-sm font-semibold text-pastel-lilac mb-2">Email</label>
        <Field
          name="email"
          id="email"
          type="email"
          :class="inputClass('email')"
          placeholder="tu@email.com"
        />
        <ErrorMessage name="email" class="mt-1.5 text-xs text-red-400" />
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full flex justify-center items-center py-3 px-4 rounded-full shadow-lg text-base font-bold text-deep-plum bg-gradient-to-r from-light-mauve to-pastel-lilac transform transition-transform duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <span>{{ isSubmitting ? 'Enviando...' : 'Solicitar Eliminación' }}</span>
      </button>
    </form>
  </div>
</template>