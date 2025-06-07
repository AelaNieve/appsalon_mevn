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
        iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', // Checkmark circle
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
        iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z', // X circle
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
        iconPath:
          'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.308 18c-.77 1.333.192 3 1.732 3z', // Exclamation triangle
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
        iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', // Info circle
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
        iconPath:
          'M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z', // Original warning icon
        animateIcon: true,
      }
  }
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
        <svg
          :class="[
            'w-8 h-8 fill-current',
            alertConfig.iconColor,
            { 'animate-bounce-slow': alertConfig.animateIcon },
          ]"
          :viewBox="type === 'default' ? '0 0 40 40' : '0 0 24 24'"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path :d="alertConfig.iconPath" />
        </svg>
      </div>

      <div class="flex-1 px-6 py-4">
        <div class="flex items-center justify-between">
          <span
            :class="[
              'font-bold text-lg tracking-wide flex items-center gap-2',
              alertConfig.titleColor,
            ]"
          >
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
            class="ml-4 p-2 rounded-full hover:bg-opacity-70 focus:outline-none focus:ring-2 transition"
            :class="[
              `hover:${alertConfig.iconBg}`, // Adjust hover background based on iconBg
              `focus:ring-${alertConfig.iconColor.split('-')[1]}-400`, // Adjust ring color based on iconColor
            ]"
            aria-label="Cerrar"
          >
            <svg
              class="w-4 h-4 text-muted-grape hover:text-deep-plum transition"
              viewBox="0 0 20 20"
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
