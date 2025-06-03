<script setup>
import { useForm, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup' // Import Yup for schema validation
import { useRouter } from 'vue-router'
import api from '../../lib/axios'

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

// Utilizamos yup en lugar de formkit por que tailwind 4.1 no es compatible
const schema = yup.object({
  name: yup.string().required('El nombre es obligatorio'),
  email: yup.string().email('Email no válido').required('El email es obligatorio'),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(MIN_PASSWORD_LENGTH, `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`)
    .test('has-uppercase', 'La contraseña necesita al menos una letra mayúscula', (value) =>
      HAS_UPPERCASE_REGEX.test(value),
    )
    .test('has-lowercase', 'La contraseña necesita al menos una letra minúscula', (value) =>
      HAS_LOWERCASE_REGEX.test(value),
    )
    .test('has-number', 'La contraseña necesita al menos un número', (value) =>
      HAS_NUMBER_REGEX.test(value),
    )
    .test(
      'has-special-char',
      'La contraseña necesita al menos un carácter especial (ej. !@#$%^&*)',
      (value) => HAS_SPECIAL_CHAR_REGEX.test(value),
    )
    .test(
      'not-repeating-chars',
      'La contraseña no debe tener secuencias de caracteres repetidos (ej. "aaaa")',
      (value) => !REPEATING_CHARS_REGEX.test(value),
    )
    .test(
      'not-simple-number-sequence',
      'La contraseña no debe contener secuencias numéricas simples (ej. "1234")',
      (value) => !SIMPLE_NUMBER_SEQUENCES_REGEX.test(value),
    )
    .test(
      'not-simple-alpha-sequence',
      'La contraseña no debe contener secuencias alfabéticas simples (ej. "abcd")',
      (value) => !SIMPLE_ALPHABET_SEQUENCES_REGEX.test(value),
    ),
  password_confirmation: yup
    .string()
    .required('Confirma tu contraseña')
    .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden'),
})

// Una vez validada la información creamos el formulario
const { handleSubmit, isSubmitting, setErrors } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  },
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
    alert(response.data.msg || '¡Cuenta creada exitosamente! Revisa tu email para confirmarla.')
    router.push({ name: 'login' }) // Una vez validada la cuenta nos lleva a la pagina de login en automatico
  } catch (error) {
    console.error('Registration failed:', error)
    if (error.response && error.response.data && error.response.data.msg) {
      alert(`Error al crear la cuenta: ${error.response.data.msg}`)
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
      alert('Error al crear la cuenta: Por favor, revisa los campos.')
    } else {
      alert('Error al crear la cuenta. Por favor, inténtalo de nuevo.')
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
        <div class="mt-1">
          <Field
            name="password"
            id="password"
            type="password"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
            placeholder="Tu Contraseña"
          />
          <ErrorMessage name="password" class="mt-2 text-sm text-red-600" />
        </div>
      </div>

      <div>
        <label for="password_confirmation" class="block text-sm font-medium text-gray-700"
          >Repetir Contraseña</label
        >
        <div class="mt-1">
          <Field
            name="password_confirmation"
            id="password_confirmation"
            type="password"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
            placeholder="Repite Tu Contraseña"
          />
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
</template>
