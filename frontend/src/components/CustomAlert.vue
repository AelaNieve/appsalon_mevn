<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['close'])
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
      v-if="visible"
      class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex w-full max-w-sm overflow-hidden bg-light-mauve rounded-lg shadow-md"
    >
      <div class="flex items-center justify-center w-12 bg-pastel-lilac">
        <svg
          class="w-6 h-6 text-deep-plum fill-current"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z"
          />
        </svg>
      </div>

      <div class="px-4 py-2 -mx-3">
        <div class="mx-3">
          <span class="font-semibold text-deep-plum">Advertencia</span>
          <p class="text-sm text-dark-indigo">Solo se puede seleccionar 2 servicios por cita.</p>
        </div>
      </div>
      <button
        @click="$emit('close')"
        class="absolute top-1 right-1 p-1 text-muted-grape hover:text-deep-plum focus:outline-none"
      >
        <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 8.586L14.293 4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414L10 8.586z"
          />
        </svg>
      </button>
    </div>
  </transition>
</template>
