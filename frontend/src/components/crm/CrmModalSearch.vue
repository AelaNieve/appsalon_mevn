<template>
  <div>
    <!-- Modal backdrop -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-out duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-show="modalOpen" class="fixed inset-0 bg-gray-900/30 z-50 transition-opacity" aria-hidden="true"></div>
    </transition>

    <!-- Modal dialog -->
    <transition
      enter-active-class="transition ease-in-out duration-200"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in-out duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-show="modalOpen"
        :id="id"
        class="fixed inset-0 z-50 overflow-hidden flex items-start top-20 mb-4 justify-center px-4 sm:px-6"
        role="dialog"
        aria-modal="true"
      >
        <div ref="modalContent" class="bg-white dark:bg-gray-800 border border-transparent dark:border-gray-700/60 overflow-auto max-w-2xl w-full max-h-full rounded-lg shadow-lg">
          <form class="border-b border-gray-200 dark:border-gray-700/60">
            <div class="relative">
              <label :for="searchId" class="sr-only">Search</label>
              <input
                :id="searchId"
                ref="searchInput"
                class="w-full dark:text-gray-300 bg-white dark:bg-gray-800 border-0 focus:ring-transparent placeholder-gray-400 dark:placeholder-gray-500 appearance-none py-3 pl-10 pr-4"
                type="search"
                placeholder="Search Anything…"
              />
              <button class="absolute inset-0 right-auto group" type="submit" aria-label="Search">
                <svg class="shrink-0 fill-current text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 ml-4 mr-2" width="16" height="16" viewBox="0 0 16 16">
                  <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                  <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  id: String,
  searchId: String,
  modalOpen: Boolean
});

const emit = defineEmits(['close-modal']);

const modalContent = ref(null);
const searchInput = ref(null);

// close on click outside
const clickHandler = ({ target }) => {
  if (!props.modalOpen || !modalContent.value || modalContent.value.contains(target)) return;
  emit('close-modal');
};

// close if the esc key is pressed
const keyHandler = ({ keyCode }) => {
  if (!props.modalOpen || keyCode !== 27) return;
  emit('close-modal');
};

onMounted(() => {
  document.addEventListener('click', clickHandler);
  document.addEventListener('keydown', keyHandler);
});

onUnmounted(() => {
  document.removeEventListener('click', clickHandler);
  document.removeEventListener('keydown', keyHandler);
});

watch(() => props.modalOpen, (open) => {
  if (open) {
    setTimeout(() => {
      searchInput.value?.focus();
    }, 100);
  }
});
</script>
