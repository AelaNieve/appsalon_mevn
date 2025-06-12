<script setup>
import { useForm, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import AuthAPI from '@/api/AuthAPI'
import { passwordRules } from '@/helpers/passwordValidation'
import { useAlertStore } from '@/stores/useAlertStore'
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'

const router = useRouter()
const alertStore = useAlertStore()
const captcha_KEY = import.meta.env.VITE_CAPTCHA_KEY
const hcaptchaToken = ref(null)

// Captcha logic
const onCaptchaVerified = (token) => {
  hcaptchaToken.value = token
}
const onCaptchaExpired = () => {
  hcaptchaToken.value = null
  alertStore.showAlert('El captcha ha expirado. Por favor, re-verifica.', 'warning')
}

// Validation Schema
const schema = yup.object({
  name: yup.string().required('El nombre es obligatorio'),
  email: yup.string().email('Email no válido').required('El email es obligatorio'),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .test('password-strength', 'La contraseña no cumple los requisitos', (value) =>
      passwordRules.every((rule) => rule.test(value))
    ),
  password_confirmation: yup
    .string()
    .required('Confirma tu contraseña')
    .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden'),
})

const {
  handleSubmit,
  isSubmitting,
  setErrors,
  values,
  errors: formErrors,
} = useForm({
  validationSchema: schema,
  initialValues: { name: '', email: '', password: '', password_confirmation: '' },
})

// Password visibility logic
const passwordFieldType = ref('password')
const passwordConfirmationFieldType = ref('password')
const togglePasswordVisibility = (field) => {
  if (field === 'password') {
    passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password'
  } else {
    passwordConfirmationFieldType.value =
      passwordConfirmationFieldType.value === 'password' ? 'text' : 'password'
  }
}

// Password criteria feedback logic
const passwordCriteriaErrors = computed(() => {
  const password = values.password
  if (!password) return []
  return passwordRules.filter((rule) => !rule.test(password)).map((rule) => rule.message)
})

// *** KEY CHANGE 1: Using the robust onSubmit function from your old component ***
const onSubmit = handleSubmit(async (vals) => {
  if (!hcaptchaToken.value) {
    alertStore.showAlert('Por favor, completa el captcha.', 'info')
    return // Stop form submission if captcha is not verified
  }

  const { name, email, password } = vals

  try {
    const response = await AuthAPI.registerUser({
      name,
      email,
      password,
      hcaptchaToken: hcaptchaToken.value, // Send the token to the backend
    })

    alertStore.showAlert(
      response.data.msg || '¡Cuenta creada! Revisa tu email para confirmarla.',
      'success',
      10000
    )
    router.push({ name: 'login' })
  } catch (error) {
    console.error('Registration failed:', error)
    let alertMessage = 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.'
    let alertType = 'error'

    if (error.response) {
      const { status, data } = error.response
      if (data && data.msg) {
        alertMessage = data.msg
      }

      switch (status) {
        case 400:
          alertType = 'error'
          if (data.errors && typeof data.errors === 'object') {
            setErrors(data.errors)
            alertMessage = 'Por favor, corrige los errores en el formulario.'
          }
          break
        case 429:
          alertType = 'warning'
          alertMessage =
            data.msg || 'Has realizado demasiados intentos. Por favor, espera un momento.'
          break
        case 500:
          alertType = 'error'
          alertMessage = data.msg || 'Problema en el servidor. Inténtalo más tarde.'
          break
        default:
          alertType = 'info'
      }
    }
    alertStore.showAlert(alertMessage, alertType, 10000)
  }
})

// Themed input classes from your new component
const inputClass = (fieldName) => [
  'block w-full rounded-lg p-3.5 border-2 bg-dark-indigo/50 text-pastel-lilac placeholder:text-muted-grape transition',
  formErrors.value[fieldName]
    ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500'
    : 'border-muted-grape/50 focus:border-light-mauve focus:ring-light-mauve',
]
</script>

<template>
  <div class="space-y-2 mb-8 text-center">
    <h1 class="text-4xl font-bold text-pastel-lilac">Crea Tu Cuenta</h1>
    <p class="text-lg text-light-mauve/90">Únete a AppSalón y agenda tus citas fácilmente.</p>
  </div>

  <!-- Themed form container from your new component -->
  <div
    class="bg-deep-plum/60 border border-muted-grape/50 rounded-2xl p-8 shadow-xl backdrop-blur-sm"
  >
    <form @submit="onSubmit" class="space-y-6">
      <!-- Name Field -->
      <div>
        <label for="name" class="block text-sm font-semibold text-pastel-lilac mb-2">Nombre</label>
        <Field
          name="name"
          id="name"
          type="text"
          :class="inputClass('name')"
          placeholder="Tu Nombre Completo"
        />
        <ErrorMessage name="name" class="mt-1.5 text-xs text-red-400" />
      </div>

      <!-- Email Field -->
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

      <!-- Password Field -->
      <div>
        <label for="password" class="block text-sm font-semibold text-pastel-lilac mb-2"
          >Contraseña</label
        >
        <div class="relative">
          <Field
            name="password"
            id="password"
            :type="passwordFieldType"
            :class="inputClass('password')"
            placeholder="Crea una contraseña segura"
            class="pr-10"
          />
          <button
            type="button"
            @click="togglePasswordVisibility('password')"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-grape hover:text-light-mauve"
            aria-label="Toggle password visibility"
          >
            <!-- *** KEY CHANGE 2: Added missing SVG icons from your old component *** -->
            <svg v-if="passwordFieldType === 'password'" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
            <svg v-else class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243L6.228 6.228" /></svg>
          </button>
        </div>
        <!-- Password Criteria Feedback -->
        <div v-if="values.password && passwordCriteriaErrors.length > 0" class="mt-2 text-xs space-y-1">
          <p class="font-medium text-pastel-lilac/80">La contraseña debe cumplir:</p>
          <ul class="list-disc list-inside pl-2">
            <li v-for="error in passwordCriteriaErrors" :key="error" class="text-red-400">
              {{ error }}
            </li>
            <template v-for="rule in passwordRules" :key="rule.message">
              <li
                v-if="rule.test(values.password) && !passwordCriteriaErrors.includes(rule.message)"
                class="text-green-400"
              >
                {{ rule.message }} ✓
              </li>
            </template>
          </ul>
        </div>
        <ErrorMessage name="password" class="mt-1.5 text-xs text-red-400" />
      </div>

      <!-- Password Confirmation Field -->
      <div>
        <label for="password_confirmation" class="block text-sm font-semibold text-pastel-lilac mb-2">Confirmar Contraseña</label>
        <div class="relative">
          <Field
            name="password_confirmation"
            id="password_confirmation"
            :type="passwordConfirmationFieldType"
            :class="inputClass('password_confirmation')"
            placeholder="Repite tu contraseña"
            class="pr-10"
          />
          <button
            type="button"
            @click="togglePasswordVisibility('password_confirmation')"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-grape hover:text-light-mauve"
            aria-label="Toggle password confirmation visibility"
          >
            <!-- *** KEY CHANGE 2: Added missing SVG icons from your old component *** -->
            <svg v-if="passwordConfirmationFieldType === 'password'" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
            <svg v-else class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243L6.228 6.228" /></svg>
          </button>
        </div>
        <ErrorMessage name="password_confirmation" class="mt-1.5 text-xs text-red-400" />
      </div>

      <!-- hCaptcha and Submit Button -->
      <div class="space-y-4">
        <div class="flex justify-center">
          <vue-hcaptcha
            :sitekey="captcha_KEY"
            @verify="onCaptchaVerified"
            @expired="onCaptchaExpired"
            theme="dark"
          ></vue-hcaptcha>
        </div>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full flex justify-center items-center py-3 px-4 rounded-full shadow-lg text-base font-bold text-deep-plum bg-gradient-to-r from-light-mauve to-pastel-lilac transform transition-transform duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-deep-plum" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span>{{ isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>