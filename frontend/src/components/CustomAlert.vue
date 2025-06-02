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
      class="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 flex w-full max-w-md overflow-hidden bg-light-mauve rounded-xl shadow-2xl border border-pastel-lilac ring-2 ring-pastel-lilac/30"
    >
      <div class="flex items-center justify-center w-16 bg-pastel-lilac rounded-l-xl">
        <svg
          class="w-8 h-8 text-deep-plum fill-current animate-bounce-slow"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z"
          />
        </svg>
      </div>

      <div class="flex-1 px-6 py-4">
        <div class="flex items-center justify-between">
          <span class="font-bold text-lg text-deep-plum tracking-wide flex items-center gap-2">
            <svg class="w-5 h-5 text-deep-plum" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Advertencia
          </span>
          <button
            @click="$emit('close')"
            class="ml-4 p-2 rounded-full hover:bg-pastel-lilac/60 focus:outline-none focus:ring-2 focus:ring-deep-plum transition"
            aria-label="Cerrar"
          >
            <svg class="w-4 h-4 text-muted-grape hover:text-deep-plum transition" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10 8.586L14.293 4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414L10 8.586z"
              />
            </svg>
          </button>
        </div>
        <p class="mt-2 text-base text-dark-indigo leading-relaxed">
          Solo se puede seleccionar <span class="font-semibold text-deep-plum">2 servicios</span> por cita.
        </p>
      </div>
    </div>
  </transition>
</template>

<style scoped>
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0);}
  50% { transform: translateY(-6px);}
}
.animate-bounce-slow {
  animation: bounce-slow 1.8s infinite;
}
</style>
