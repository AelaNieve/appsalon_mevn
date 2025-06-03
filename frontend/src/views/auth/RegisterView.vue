<script setup>
import { useForm, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useRouter } from 'vue-router'
import api from '../../lib/axios'
import { ref, computed } from 'vue' // Import 'computed'
import CustomAlert from '@/views/CustomAlert.vue'

const router = useRouter()

// --- Cheo que contraseña segura (Igual a backend\controllers\authControllers.js pero
// sin la validación de la contraseña publica) ---
const MIN_PASSWORD_LENGTH = 16
const HAS_UPPERCASE_REGEX = /[A-Z]/
const HAS_LOWERCASE_REGEX = /[a-z]/
const HAS_NUMBER_REGEX = /[0-9]/
const HAS_SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>]/
const REPEATING_CHARS_REGEX = /(.)\1{3,}/
const SIMPLE_NUMBER_SEQUENCES_REGEX =
  /123|234|345|456|567|678|789|890|098|987|876|765|654|543|432|321/
const SIMPLE_ALPHABET_SEQUENCES_REGEX =
  /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i

// Define password validation rules with descriptive messages
const passwordRules = [
  {
    test: (value) => value && value.length >= MIN_PASSWORD_LENGTH,
    message: `Debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
  },
  {
    test: (value) => value && HAS_UPPERCASE_REGEX.test(value),
    message: 'Debe incluir al menos una letra mayúscula',
  },
  {
    test: (value) => value && HAS_LOWERCASE_REGEX.test(value),
    message: 'Debe incluir al menos una letra minúscula',
  },
  {
    test: (value) => value && HAS_NUMBER_REGEX.test(value),
    message: 'Debe incluir al menos un número',
  },
  {
    test: (value) => value && HAS_SPECIAL_CHAR_REGEX.test(value),
    message: 'Debe incluir al menos un carácter especial (ej. !@#$%^&*)',
  },
  {
    test: (value) => value && !REPEATING_CHARS_REGEX.test(value),
    message: 'No debe tener secuencias de caracteres repetidos (ej. "aaaa")',
  },
  {
    test: (value) => value && !SIMPLE_NUMBER_SEQUENCES_REGEX.test(value),
    message: 'No debe contener secuencias numéricas simples (ej. "1234")',
  },
  {
    test: (value) => value && !SIMPLE_ALPHABET_SEQUENCES_REGEX.test(value),
    message: 'No debe contener secuencias alfabéticas simples (ej. "abcd")',
  },
]

// Utilizamos yup en lugar de formkit por que tailwind 4.1 no es compatible
const schema = yup.object({
  name: yup.string().required('El nombre es obligatorio'),
  email: yup.string().email('Email no válido').required('El email es obligatorio'),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .test('password-strength', 'La contraseña no cumple los requisitos', (value) => {
      // This combined test will allow us to trigger the display of all rules
      // We don't return specific messages here as they will be handled by the computed property
      return passwordRules.every((rule) => rule.test(value))
    }),
  password_confirmation: yup
    .string()
    .required('Confirma tu contraseña')
    .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden'),
})

// Una vez validada la información creamos el formulario
const { handleSubmit, isSubmitting, setErrors, values } = useForm({
  // Add 'values'
  validationSchema: schema,
  initialValues: {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  },
})

// Custom Alert State
const showAlert = ref(false)
const alertMessage = ref('')

const handleDismissAlert = () => {
  showAlert.value = false
  alertMessage.value = ''
}

// State for password visibility
const passwordFieldType = ref('password')
const passwordConfirmationFieldType = ref('password')

// Function to toggle password visibility
const togglePasswordVisibility = (field) => {
  if (field === 'password') {
    passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password'
  } else if (field === 'password_confirmation') {
    passwordConfirmationFieldType.value =
      passwordConfirmationFieldType.value === 'password' ? 'text' : 'password'
  }
}

// Computed property to check password criteria and return messages for failed ones
const passwordCriteriaErrors = computed(() => {
  const password = values.password // Access password from useForm's values
  if (!password) return [] // No password, no errors to show yet

  return passwordRules.filter((rule) => !rule.test(password)).map((rule) => rule.message)
})

// Funcion que intentara sincryonizar el formulario y enviarlo a mongodb
const onSubmit = handleSubmit(async (values) => {
  const { name, email, password } = values

  try {
    // Llamando a la API desde servicesAPI.js
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
    })

    // El backend debe responder de forma exitosa antes de continuar
    showAlert.value = true
    alertMessage.value =
      response.data.msg || '¡Cuenta creada exitosamente! Revisa tu email para confirmarla.'

    // Add a 2.5-second delay before navigating
    setTimeout(() => {
      router.push({ name: 'login' })
    }, 2500) // 2500 milliseconds = 2.5 seconds
  } catch (error) {
    console.error('Registration failed:', error)
    if (error.response && error.response.data && error.response.data.msg) {
      showAlert.value = true
      alertMessage.value = `Error al crear la cuenta: ${error.response.data.msg}`
    } else if (error.response && error.response.data && error.response.data.errors) {
      // Utilizando el error de respuesta del backend
      const backendErrors = error.response.data.errors
      if (typeof backendErrors === 'object' && backendErrors !== null) {
        Object.entries(backendErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            setErrors({ [field]: messages[0] }) // Set the first message for the field
          }
        })
      }
      showAlert.value = true
      alertMessage.value = 'Error al crear la cuenta: Por favor, revisa los campos.'
    } else {
      showAlert.value = true
      alertMessage.value = 'Error al crear la cuenta. Por favor, inténtalo de nuevo.'
    }
  }
})
</script>

<template>
  <h1 class="text-6xl font-extrabold text-white text-center mt-10">Crea Tu Cuenta</h1>
  <p class="text-2xl text-white text-center my-5">Crear una cuenta en AppSalón</p>

  <div class="bg-white shadow rounded-lg p-10">
    <form @submit="onSubmit" class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
        <div class="mt-1">
          <Field
            name="name"
            id="name"
            type="text"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
            placeholder="Tu Nombre"
          />
          <ErrorMessage name="name" class="mt-2 text-sm text-red-600" />
        </div>
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <div class="mt-1">
          <Field
            name="email"
            id="email"
            type="email"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
            placeholder="Tu Email"
          />
          <ErrorMessage name="email" class="mt-2 text-sm text-red-600" />
        </div>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
        <div class="mt-1 relative">
          <Field
            name="password"
            id="password"
            :type="passwordFieldType"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border pr-10"
            placeholder="Tu Contraseña"
          />
          <button
            type="button"
            @click="togglePasswordVisibility('password')"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
          >
            <span class="text-gray-500">
              {{ passwordFieldType === 'password' ? '👁️' : '🙈' }}
            </span>
          </button>
          <div v-if="passwordCriteriaErrors.length > 0" class="mt-2 text-sm text-red-600">
            <p>La contraseña no cumple con los siguientes requisitos:</p>
            <ul class="list-disc list-inside">
              <li v-for="error in passwordCriteriaErrors" :key="error">{{ error }}</li>
            </ul>
          </div>
          <ErrorMessage name="password" class="mt-2 text-sm text-red-600" />
        </div>
      </div>

      <div>
        <label for="password_confirmation" class="block text-sm font-medium text-gray-700"
          >Repetir Contraseña</label
        >
        <div class="mt-1 relative">
          <Field
            name="password_confirmation"
            id="password_confirmation"
            :type="passwordConfirmationFieldType"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border pr-10"
            placeholder="Repite Tu Contraseña"
          />
          <button
            type="button"
            @click="togglePasswordVisibility('password_confirmation')"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
          >
            <span class="text-gray-500">
              {{ passwordConfirmationFieldType === 'password' ? '👁️' : '🙈' }}
            </span>
          </button>
          <ErrorMessage name="password_confirmation" class="mt-2 text-sm text-red-600" />
        </div>
      </div>

      <div>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }"
        >
          <span v-if="!isSubmitting">Crear Cuenta</span>
          <span v-else>Creando cuenta...</span>
        </button>
      </div>
    </form>
  </div>
  <CustomAlert :visible="showAlert" :message="alertMessage" @close="handleDismissAlert" />
</template>
