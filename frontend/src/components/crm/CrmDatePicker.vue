<template>
  <div class="grid gap-2">
    <div class="relative inline-flex">
      <button
        id="date"
        class="btn px-2.5 min-w-[15.5rem] bg-white border border-gray-200 hover:border-gray-300 dark:border-gray-700/60 dark:hover:border-gray-600 dark:bg-gray-800 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 font-medium text-left justify-start rounded-lg shadow-sm"
      >
        <svg class="fill-current text-gray-400 dark:text-gray-500 ml-1 mr-2 inline-block" width="16" height="16" viewBox="0 0 16 16">
          <path d="M5 4a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z"></path>
          <path d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4ZM2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z"></path>
        </svg>
        <span>{{ formattedDate }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

defineProps({
  align: String
});

const date = ref({
  from: new Date(2022, 0, 20),
  to: new Date(2022, 1, 9)
});

const formattedDate = computed(() => {
  if (date.value.from && date.value.to) {
    return `${formatDate(date.value.from)} - ${formatDate(date.value.to)}`;
  }
  return formatDate(date.value.from) || 'Pick a date';
});

function formatDate(d) {
  if (!d) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}
</script>
