// frontend/src/router/index.js

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/components/HomeView.vue'
import AuthLayout from '@/components/AuthLayout.vue'
import AppointmentsLayout from '@/components/AppointmentsLayout.vue'
import AdminLayout from '../components/AdminLayout.vue'
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
      path: '/admin',
      name: 'admin',
      component: AdminLayout,
      meta: { requiresAdmin: true },
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
router.beforeEach(async (to, from, next) => {
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAdmin) {
    // 1. This route requires admin access.
    try {
      await AuthAPI.adminAuth() // Attempt to authenticate as an admin.
      next() // User is an admin, allow access.
    } catch (error) {
      // Failed admin check. The user is either not logged in or not an admin.
      // We'll redirect to the user's appointments page as a safe fallback.
      next({ name: 'home' })
    }
  } else if (requiresAuth) {
    // 2. This route requires standard authentication.
    try {
      await AuthAPI.auth() // Attempt to authenticate as a regular user.
      next() // User is logged in, allow access.
    } catch (error) {
      // User is not logged in.
      next({ name: 'login' }) // Redirect to login page.
    }
  } else {
    // 3. This is a public route (or an auth route like /login).
    let isAuthenticated = false
    try {
      await AuthAPI.auth()
      isAuthenticated = true
    } catch (error) {
      // User is not authenticated, which is fine for public routes.
    }

    const isAuthRoute = to.matched.some((record) => record.name === 'auth')
    if (isAuthRoute && isAuthenticated) {
      // If the user is already logged in, redirect them away from auth pages.
      next({ name: 'home' })
    } else {
      // Otherwise, allow access to the public route.
      next()
    }
  }
})
// --- END OF REPLACEMENT ---

export default router