// frontend/src/router/index.js

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/components/HomeView.vue'
import AuthLayout from '@/components/AuthLayout.vue'
import AppointmentsLayout from '@/components/AppointmentsLayout.vue'
import AuthAPI from '@/api/AuthAPI'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/reservaciones',
      name: 'appointments',
      component: AppointmentsLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'my-appointments',
          component: () => import('../views/appointments/MyAppointmentsView.vue'),
        },
        {
          path: 'nueva',
          component: () => import('../views/appointments/NewAppointmentsLayout.vue'),
          children: [
            {
              path: '',
              name: 'new-appointment',
              component: () => import('../views/appointments/ServicesView.vue'),
            },
            {
              path: 'detalles',
              name: 'appointment-details',
              component: () => import('../views/appointments/AppoinmentView.vue'),
            },
          ],
        },
        {
          path: ':id/editar',
          component: () => import('../views/appointments/EditAppointmentLayout.vue'),
          children: [
            {
              path: '',
              name: 'edit-appointment',
              component: () => import('../views/appointments/ServicesView.vue'),
            },
            {
              path: 'detalles',
              name: 'edit-appointment-details',
              component: () => import('../views/appointments/AppoinmentView.vue'),
            },
          ],
        },
      ],
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthLayout,
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/auth/LoginView.vue'),
        },
        {
          path: 'registro',
          name: 'register',
          component: () => import('../views/auth/RegisterView.vue'),
        },
        {
          path: 'confirmar',
          name: 'confirm',
          component: () => import('../views/auth/ConfirmView.vue'),
          children: [
            {
              path: 'account/:token',
              name: 'cuenta',
              component: () => import('../views/auth/ConfirmView/ConfirmAccountView.vue'),
            },
            {
              path: 'borrar-cuenta/:token',
              name: 'delete-account',
              component: () => import('../views/auth/ConfirmView/ConfirmDeleteView.vue'),
            },
            {
              path: 'resetear-contrasena/:token',
              name: 'reset-password',
              component: () => import('../views/auth/ConfirmView/ConfirmPasswordView.vue'),
            },
          ],
        },
        {
          path: 'problemas',
          name: 'problems',
          component: () => import('../views/auth/ProblemsView.vue'),
          children: [
            {
              path: 'requerir-borrar-cuenta',
              name: 'request-delete-account',
              component: () => import('../views/auth/ProblemsView/RequestDeletionView.vue'),
            },
            {
              path: 'requerir-resetear-contraseña',
              name: 'forgot-password',
              component: () => import('../views/auth/ProblemsView/RequestPasswordView.vue'),
            },
          ],
        },
      ],
    },
  ],
})

// --- START OF FIX ---
// Replaced the old guard with a more robust one.
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const isAuthRoute = to.matched.some((record) => record.name === 'auth')

  let isAuthenticated = false
  try {
    // We check for a valid session on every navigation.
    await AuthAPI.auth()
    isAuthenticated = true
  } catch (error) {
    isAuthenticated = false
  }

  if (requiresAuth && !isAuthenticated) {
    // Case 1: Trying to access a protected route without being authenticated.
    // Redirect to login.
    return next({ name: 'login' })
  }

  if (isAuthRoute && isAuthenticated) {
    // Case 2: Trying to access an auth page (login, register) while already authenticated.
    // Redirect to the main app view.
    return next({ name: 'my-appointments' })
  }

  // Case 3: All other scenarios are allowed.
  // - Accessing a public route like Home (authenticated or not).
  // - Accessing a protected route (when authenticated).
  // - Accessing an auth route (when not authenticated).
  next()
})
// --- END OF FIX ---

export default router