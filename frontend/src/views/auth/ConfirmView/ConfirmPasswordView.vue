<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import AuthAPI from '@/api/AuthAPI'
import { useAlertStore } from '@/stores/useAlertStore'
import FormInput from '@/components/FormInput.vue' // Assuming you have a reusable input component

// Setup
const alertStore = useAlertStore()
const route = useRoute()
const router = useRouter()
const { token } = route.params

// Form Validation Schema
const schema = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  password_confirm: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords do not match')
    .required('Password confirmation is required'),
})

// VeeValidate Form Handling
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema,
})

const { value: password, errorMessage: passwordError } = useField('password')
const { value: password_confirm, errorMessage: passwordConfirmError } = useField('password_confirm')

// Actions
const onSubmit = handleSubmit(async (values) => {
  try {
    const payload = {
      password: values.password,
      passwordResetToken: token, // Backend expects 'passwordResetToken' in the body
    }
    const { data } = await AuthAPI.resetPassword(payload)
    alertStore.showAlert(data.msg, 'success')
    // Redirect to login after a short delay
    setTimeout(() => {
      router.push({ name: 'login' })
    }, 3000)
  } catch (error) {
    console.error('Password reset failed:', error)
    alertStore.showAlert(error.response?.data?.msg || 'Failed to reset password.', 'error')
  }
})
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-4xl font-extrabold text-white text-center">Reset Password</h1>
    <p class="text-lg text-gray-300 text-center">Enter your new password below.</p>

    <form @submit="onSubmit" class="space-y-6" novalidate>
      <FormInput
        label="New Password"
        type="password"
        placeholder="Your New Password"
        v-model="password"
        :error="passwordError"
      />

      <FormInput
        label="Confirm New Password"
        type="password"
        placeholder="Confirm Your New Password"
        v-model="password_confirm"
        :error="passwordConfirmError"
      />

      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline disabled:opacity-50"
      >
        {{ isSubmitting ? 'Saving...' : 'Save New Password' }}
      </button>
    </form>
  </div>
</template>
