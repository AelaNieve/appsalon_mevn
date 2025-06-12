<script setup>
import { useForm, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthAPI from '@/api/AuthAPI'
import { useAlertStore } from '@/stores/useAlertStore'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const alertStore = useAlertStore()
const router = useRouter()

// Validation Schema (no changes needed)
const schema = yup.object({
  email: yup.string().email('Email no válido').required('El email es obligatorio'),
  password: yup.string().required('La contraseña es obligatoria'),
})

const {
  handleSubmit,
  isSubmitting,
  setErrors,
  errors: formErrors,
} = useForm({
  validationSchema: schema,
  initialValues: { email: '', password: '' },
})

const passwordFieldType = ref('password')
const togglePasswordVisibility = () => {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password'
}

const onSubmit = handleSubmit(async (values) => {
  try {
    const { data } = await AuthAPI.login(values)
    await userStore.fetchUser()
    userStore.startAutoLogoutTimer()
    alertStore.showAlert(data.msg, 'success')
    router.push({ name: 'my-appointments' })
  } catch (error) {
    let alertMessage = 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.'
    if (error.response) {
      alertMessage = error.response.data.msg || alertMessage
      if (error.response.data.errors) setErrors(error.response.data.errors)
    }
    alertStore.showAlert(alertMessage, 'error', 10000)
  }
})

// Themed input classes
const inputClass = (fieldName) => [
  'block w-full rounded-lg p-3.5 border-2 bg-dark-indigo/50 text-pastel-lilac placeholder:text-muted-grape transition',
  formErrors.value[fieldName]
    ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500'
    : 'border-muted-grape/50 focus:border-light-mauve focus:ring-light-mauve',
]
</script>

<template>
  <div class="space-y-2 mb-8 text-center">
    <h1 class="text-4xl font-bold text-pastel-lilac">Iniciar Sesión</h1>
    <p class="text-lg text-light-mauve/90">Accede a tu cuenta para gestionar tus citas.</p>
  </div>

  <!-- Themed form container -->
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

      <div>
        <label for="password" class="block text-sm font-semibold text-pastel-lilac mb-2">Contraseña</label>
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
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-grape hover:text-light-mauve"
            aria-label="Toggle password visibility"
          >
            <!-- SVG icons are fine, no changes needed -->
            <svg v-if="passwordFieldType === 'password'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
          </button>
        </div>
        <ErrorMessage name="password" class="mt-1.5 text-xs text-red-400" />
      </div>

      <div class="flex items-center justify-end">
        <div class="text-sm">
          <RouterLink
            :to="{ name: 'forgot-password' }"
            class="font-medium text-light-mauve hover:text-pastel-lilac transition"
          >
            ¿Olvidaste tu contraseña?
          </RouterLink>
        </div>
      </div>

      <div>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full flex justify-center items-center py-3 px-4 rounded-full shadow-lg text-base font-bold text-deep-plum bg-gradient-to-r from-light-mauve to-pastel-lilac transform transition-transform duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-deep-plum" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span>{{ isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>