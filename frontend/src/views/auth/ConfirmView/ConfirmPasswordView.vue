<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import AuthAPI from '@/api/AuthAPI'
import { passwordRules } from '@/helpers/passwordValidation'
import { useAlertStore } from '@/stores/useAlertStore'

// Setup stores, router, and route access
const router = useRouter()
const route = useRoute()
const alertStore = useAlertStore()

const { token } = route.params
const isValidToken = ref(false)
const isLoading = ref(true)

// Password visibility toggles
const passwordFieldType = ref('password')
const passwordConfirmationFieldType = ref('password')

const togglePasswordVisibility = (field) => {
  if (field === 'password') {
    passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password'
  } else if (field === 'password_confirmation') {
    passwordConfirmationFieldType.value =
      passwordConfirmationFieldType.value === 'password' ? 'text' : 'password'
  }
}

// Validation Schema using Yup, similar to RegisterView
const schema = yup.object({
  password: yup
    .string()
    .required('La nueva contraseña es obligatoria')
    .test('password-strength', 'La contraseña no cumple los requisitos', (value) => {
      return passwordRules.every((rule) => rule.test(value))
    }),
  password_confirmation: yup
    .string()
    .required('Confirma tu nueva contraseña')
    .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden'),
})

const {
  handleSubmit,
  isSubmitting,
  values,
  errors: formErrors,
} = useForm({
  validationSchema: schema,
  initialValues: {
    password: '',
    password_confirmation: '',
  },
})

// Dynamic feedback for password criteria
const passwordCriteriaErrors = computed(() => {
  const password = values.password
  if (!password) return []
  return passwordRules.filter((rule) => !rule.test(password)).map((rule) => rule.message)
})

// Form submission handler
const onSubmit = handleSubmit(async (formValues) => {
  try {
    const { data } = await AuthAPI.resetPassword({
      token,
      password: formValues.password,
    })
    alertStore.showAlert(data.msg, 'success', 8000)
    router.push({ name: 'login' })
  } catch (error) {
    alertStore.showAlert(
      error.response?.data?.msg || 'No se pudo restablecer la contraseña.',
      'error',
      8000,
    )
  }
})

// Dynamic class for input fields based on validation state
const inputClass = (fieldName) => [
  'block w-full rounded-md shadow-sm sm:text-sm p-3.5 border',
  formErrors.value[fieldName]
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
]

// Verify token on component mount
onMounted(async () => {
  // We can't *truly* verify the token on the frontend without exposing info.
  // The backend `resetPassword` controller is the single source of truth.
  // We will just assume the token is valid and let the backend reject it on submit.
  // This provides a better UX than showing an immediate error.
  isValidToken.value = true
  isLoading.value = false
})
</script>

<template>
  <div
    v-if="isLoading"
    class="flex flex-col items-center justify-center text-center px-4 space-y-6"
  >
    <h1 class="text-4xl md:text-5xl font-extrabold text-white">Verificando...</h1>
    <div
      class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mt-6"
    ></div>
  </div>

  <div v-else-if="isValidToken">
    <div class="space-y-4 mb-8 text-center">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-white">Restablecer Contraseña</h1>
      <p class="text-lg text-slate-300">Crea una nueva contraseña para tu cuenta.</p>
    </div>

    <div class="bg-white shadow-xl rounded-lg p-8 sm:p-10">
      <form @submit="onSubmit" class="space-y-6">
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1"
            >Nueva Contraseña</label
          >
          <div class="relative">
            <Field
              name="password"
              id="password"
              :type="passwordFieldType"
              :class="inputClass('password')"
              placeholder="Tu nueva contraseña"
              class="pr-10"
            />
            <button
              type="button"
              @click="togglePasswordVisibility('password')"
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
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5 1.053 0 2.05-.138 2.986-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243L6.228 6.228"
                />
              </svg>
            </button>
          </div>
          <div
            v-if="values.password && passwordCriteriaErrors.length > 0"
            class="mt-2 text-xs text-gray-600 space-y-1"
          >
            <p class="font-medium text-gray-700">La contraseña debe cumplir:</p>
            <ul class="list-disc list-inside pl-2">
              <li v-for="error in passwordCriteriaErrors" :key="error" class="text-red-600">
                {{ error }}
              </li>
              <template v-for="rule in passwordRules" :key="rule.message">
                <li
                  v-if="
                    rule.test(values.password) && !passwordCriteriaErrors.includes(rule.message)
                  "
                  class="text-green-600"
                >
                  {{ rule.message }} ✓
                </li>
              </template>
            </ul>
          </div>
          <ErrorMessage name="password" class="mt-1.5 text-xs text-red-600" />
        </div>

        <div>
          <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-1"
            >Confirmar Contraseña</label
          >
          <div class="relative">
            <Field
              name="password_confirmation"
              id="password_confirmation"
              :type="passwordConfirmationFieldType"
              :class="inputClass('password_confirmation')"
              placeholder="Repite tu nueva contraseña"
              class="pr-10"
            />
            <button
              type="button"
              @click="togglePasswordVisibility('password_confirmation')"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700"
              aria-label="Toggle password confirmation visibility"
            >
              <svg
                v-if="passwordConfirmationFieldType === 'password'"
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
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5 1.053 0 2.05-.138 2.986-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243L6.228 6.228"
                />
              </svg>
            </button>
          </div>
          <ErrorMessage name="password_confirmation" class="mt-1.5 text-xs text-red-600" />
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
            <span>{{ isSubmitting ? 'Guardando...' : 'Guardar Contraseña' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <div v-else class="flex flex-col items-center justify-center text-center px-4 space-y-6">
    <svg
      class="w-20 h-20 text-red-400 mx-auto"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
    <h1 class="text-4xl md:text-5xl font-extrabold text-white">Enlace no válido</h1>
    <p class="text-lg md:text-xl text-gray-300">
      El enlace para restablecer la contraseña no es válido o ha expirado.
    </p>
    <p class="text-md text-gray-400">
      Por favor, solicita uno nuevo desde la página de inicio de sesión.
    </p>
  </div>
</template>
