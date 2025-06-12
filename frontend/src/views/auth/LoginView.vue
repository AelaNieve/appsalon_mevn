<script setup>
import { useForm, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { ref } from 'vue'
import AuthAPI from '@/api/AuthAPI'
import { useAlertStore } from '@/stores/useAlertStore'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
const userStore = useUserStore()

const alertStore = useAlertStore()
const router = useRouter()

// Validation Schema
const schema = yup.object({
  email: yup.string().email('Email no válido').required('El email es obligatorio'),
  password: yup.string().required('La contraseña es obligatoria'),
})

// Form setup with vee-validate
const {
  handleSubmit,
  isSubmitting,
  setErrors,
  errors: formErrors,
} = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
    password: '',
  },
})

// Password Visibility
const passwordFieldType = ref('password')
const togglePasswordVisibility = () => {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password'
}

// Submission Handler
const onSubmit = handleSubmit(async (values) => {
  try {
    const { data } = await AuthAPI.login(values)
    await userStore.fetchUser() // <-- fetch and set user data after login
    userStore.startAutoLogoutTimer()
    alertStore.showAlert(data.msg)
    router.push({ name: 'home' })
  } catch (error) {
    console.error('Login failed:', error)

    let alertMessage = 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.'

    if (error.response) {
      alertMessage = error.response.data.msg || alertMessage
      // If the backend provides specific field errors, you can set them
      if (error.response.data.errors) {
        setErrors(error.response.data.errors)
      }
    }
    alertStore.showAlert(alertMessage, 'error', 10000)
  }
})

const inputClass = (fieldName) => [
  'block w-full rounded-md shadow-sm sm:text-sm p-3.5 border',
  formErrors.value[fieldName]
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
]
</script>

<template>
  <div class="space-y-4 mb-8 text-center">
    <h1 class="text-4xl sm:text-5xl font-extrabold text-white">Iniciar Sesión</h1>
    <p class="text-lg text-slate-300">Ingresa tus credenciales para acceder a tu cuenta.</p>
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

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1"
          >Contraseña</label
        >
        <div class="relative">
          <Field
            name="password"
            id="password"
            :type="passwordFieldType"
            :class="inputClass('password')"
            placeholder="Tu contraseña"
            class="pr-10"
          />
          <button
            type="button"
            @click="togglePasswordVisibility"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700"
            aria-label="Toggle password visibility"
          >
            <svg
              v-if="passwordFieldType === 'password'"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243L6.228 6.228"
              />
            </svg>
          </button>
        </div>
        <ErrorMessage name="password" class="mt-1.5 text-xs text-red-600" />
      </div>

      <div class="flex items-center justify-between">
        <div class="text-sm">
          <RouterLink
            :to="{ name: 'forgot-password' }"
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            ¿Olvidaste tu contraseña?
          </RouterLink>
        </div>
      </div>

      <div>
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
          <span>{{ isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>
