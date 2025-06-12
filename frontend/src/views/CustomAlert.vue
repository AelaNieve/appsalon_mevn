<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    default: 'Algo salio mal!',
  },
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['success', 'error', 'warning', 'info', 'default'].includes(value),
  },
})

const emit = defineEmits(['close'])

// Define classes and content based on alert type
const alertConfig = computed(() => {
  switch (props.type) {
    case 'success':
      return {
        bgColor: 'bg-green-100',
        borderColor: 'border-green-300',
        ringColor: 'ring-green-300/30',
        iconBg: 'bg-green-300',
        iconColor: 'text-green-800',
        title: 'Exito!',
        titleColor: 'text-green-800',
        messageColor: 'text-green-700',
        // Correct path for an outline checkmark circle
        iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        animateIcon: true,
      }
    case 'error':
      return {
        bgColor: 'bg-red-100',
        borderColor: 'border-red-300',
        ringColor: 'ring-red-300/30',
        iconBg: 'bg-red-300',
        iconColor: 'text-red-800',
        title: 'Error!',
        titleColor: 'text-red-800',
        messageColor: 'text-red-700',
        // Correct path for an outline X-circle
        iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
        animateIcon: false,
      }
    case 'warning':
      return {
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-300',
        ringColor: 'ring-yellow-300/30',
        iconBg: 'bg-yellow-300',
        iconColor: 'text-yellow-800',
        title: 'Advertencia!',
        titleColor: 'text-yellow-800',
        messageColor: 'text-yellow-700',
        // New path for a SOLID exclamation triangle (from Heroicons)
        iconPath:
          'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
        animateIcon: true,
      }
    case 'info':
      return {
        bgColor: 'bg-blue-100',
        borderColor: 'border-blue-300',
        ringColor: 'ring-blue-300/30',
        iconBg: 'bg-blue-300',
        iconColor: 'text-blue-800',
        title: 'Informacion',
        titleColor: 'text-blue-800',
        messageColor: 'text-blue-700',
        // Correct path for an outline info circle
        iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        animateIcon: false,
      }
    case 'default':
    default:
      return {
        bgColor: 'bg-light-mauve',
        borderColor: 'border-pastel-lilac',
        ringColor: 'ring-pastel-lilac/30',
        iconBg: 'bg-pastel-lilac',
        iconColor: 'text-deep-plum',
        title: 'Notificación',
        titleColor: 'text-deep-plum',
        messageColor: 'text-dark-indigo',
        // Path for a filled icon
        iconPath:
          'M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z',
        animateIcon: true,
      }
  }
})

// A more robust way to handle dynamic hover/focus classes for Tailwind
const closeButtonClasses = computed(() => {
  const colorName = alertConfig.value.iconColor.split('-')[1] // e.g., 'green' from 'text-green-800'
  const hoverBg = alertConfig.value.iconBg

  // Map color names to their focus ring counterparts
  const focusRingMap = {
    green: 'focus:ring-green-400',
    red: 'focus:ring-red-400',
    yellow: 'focus:ring-yellow-400',
    blue: 'focus:ring-blue-400',
    'deep-plum': 'focus:ring-pastel-lilac', // Custom mapping for default
  }

  return [`hover:${hoverBg}`, focusRingMap[colorName] || 'focus:ring-gray-400']
})
</script>

<template>
  <transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      :class="[
        'flex w-full max-w-md overflow-hidden rounded-xl shadow-2xl border ring-2',
        alertConfig.bgColor,
        alertConfig.borderColor,
        alertConfig.ringColor,
      ]"
    >
      <div :class="['flex items-center justify-center w-16 rounded-l-xl', alertConfig.iconBg]">
        <!-- ====== FIX STARTS HERE ====== -->

        <!-- SVG for FILLED icons (like your 'default' type) -->
        <svg
          v-if="type === 'default'"
          :class="['w-8 h-8 fill-current', alertConfig.iconColor, { 'animate-bounce-slow': alertConfig.animateIcon }]"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- `fill-rule` helps render complex shapes correctly -->
          <path fill-rule="evenodd" clip-rule="evenodd" :d="alertConfig.iconPath" />
        </svg>

        <!-- SVG for OUTLINE icons (success, error, warning, info) -->
        <svg
          v-else
          :class="['w-8 h-8', alertConfig.iconColor, { 'animate-bounce-slow': alertConfig.animateIcon }]"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path stroke-linecap="round" stroke-linejoin="round" :d="alertConfig.iconPath" />
        </svg>

        <!-- ====== FIX ENDS HERE ====== -->
      </div>

      <div class="flex-1 px-6 py-4">
        <div class="flex items-center justify-between">
          <span
            :class="['font-bold text-lg tracking-wide flex items-center gap-2', alertConfig.titleColor]"
          >
            <!-- This small icon next to the title was already correct -->
            <svg
              v-if="type !== 'default'"
              :class="['w-5 h-5', alertConfig.titleColor]"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" :d="alertConfig.iconPath" />
            </svg>
            {{ alertConfig.title }}
          </span>
          <button
            @click="$emit('close', id)"
            :class="[
              'ml-4 p-2 rounded-full hover:bg-opacity-70 focus:outline-none focus:ring-2 transition',
              closeButtonClasses,
            ]"
            aria-label="Cerrar"
          >
            <svg
              class="w-4 h-4 text-muted-grape hover:text-deep-plum transition"
              viewBox="0 0 20 20"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 8.586L14.293 4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414L10 8.586z"
              />
            </svg>
          </button>
        </div>
        <p :class="['mt-2 text-base leading-relaxed', alertConfig.messageColor]">
          {{ message }}
        </p>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* Keep your bounce-slow animation */
@keyframes bounce-slow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}
.animate-bounce-slow {
  animation: bounce-slow 1.8s infinite;
}
</style>