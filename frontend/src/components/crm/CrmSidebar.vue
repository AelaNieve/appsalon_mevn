<template>
  <div class="min-w-fit">
    <!-- Sidebar backdrop (mobile only) -->
    <div
      class="fixed inset-0 bg-gray-900/30 z-40 lg:hidden lg:z-auto transition-opacity duration-200"
      :class="sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
      aria-hidden="true"
    ></div>

    <!-- Sidebar -->
    <div
      id="sidebar"
      ref="sidebar"
      class="flex lg:flex! flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:w-64! shrink-0 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out"
      :class="[
        sidebarOpen ? 'translate-x-0' : '-translate-x-64',
        variant === 'v2' ? 'border-r border-gray-200 dark:border-gray-700/60' : 'rounded-r-2xl shadow-xs'
      ]"
    >
      <!-- Sidebar header -->
      <div class="flex justify-between mb-10 pr-3 sm:px-2">
        <!-- Close button -->
        <button
          ref="trigger"
          class="lg:hidden text-gray-500 hover:text-gray-400"
          @click="$emit('close-sidebar')"
          aria-controls="sidebar"
          :aria-expanded="sidebarOpen"
        >
          <span class="sr-only">Close sidebar</span>
          <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
          </svg>
        </button>
        <!-- Logo -->
        <router-link :to="{ name: 'crm-dashboard' }" class="block">
          <svg class="fill-violet-500" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
            <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
          </svg>
        </router-link>
      </div>

      <!-- Links -->
      <div class="space-y-8">
        <!-- Pages group -->
        <div>
          <h3 class="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
            <span class="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
              •••
            </span>
            <span class="lg:hidden lg:sidebar-expanded:block 2xl:block">Pages</span>
          </h3>
          <ul class="mt-3">
            <!-- Dashboard -->
            <li class="pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r" :class="isDashboardActive ? 'from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]' : ''">
              <a
                href="#0"
                class="block text-gray-800 dark:text-gray-100 truncate transition duration-150"
                :class="!isDashboardActive ? 'hover:text-gray-900 dark:hover:text-white' : ''"
                @click.prevent="toggleDashboard"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <svg class="shrink-0 fill-current" :class="isDashboardActive ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                      <path d="M5.936.278A7.983 7.983 0 0 1 8 0a8 8 0 1 1-8 8c0-.722.104-1.413.278-2.064a1 1 0 1 1 1.932.516A5.99 5.99 0 0 0 2 8a6 6 0 1 0 6-6c-.53 0-1.045.076-1.548.21A1 1 0 1 1 5.936.278Z" />
                      <path d="M6.068 7.482A2.003 2.003 0 0 0 8 10a2 2 0 1 0-.518-3.932L3.707 2.293a1 1 0 0 0-1.414 1.414l3.775 3.775Z" />
                    </svg>
                    <span class="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Dashboard
                    </span>
                  </div>
                  <!-- Icon -->
                  <div class="flex shrink-0 ml-2">
                    <svg class="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 transition-transform duration-200" :class="dashboardOpen ? 'rotate-180' : ''" viewBox="0 0 12 12">
                      <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                    </svg>
                  </div>
                </div>
              </a>
              <div class="lg:hidden lg:sidebar-expanded:block 2xl:block">
                <ul class="pl-8 mt-1" :class="!dashboardOpen ? 'hidden' : ''">
                  <li class="mb-1 last:mb-0">
                    <router-link
                      to="/crm"
                      v-slot="{ isActive }"
                      class="block transition duration-150 truncate"
                    >
                      <span
                        class="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                        :class="isActive ? 'text-violet-500' : 'text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
                      >
                        Main HI
                      </span>
                    </router-link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  sidebarOpen: Boolean,
  variant: {
    type: String,
    default: 'default'
  }
});

const emit = defineEmits(['close-sidebar', 'update:sidebarExpanded']);

const route = useRoute();
const trigger = ref(null);
const sidebar = ref(null);

const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
const sidebarExpanded = ref(storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true');

const dashboardOpen = ref(route.path === '/crm' || route.path.includes('dashboard'));
const isDashboardActive = computed(() => route.path === '/crm' || route.path.includes('dashboard'));

const toggleDashboard = () => {
  dashboardOpen.value = !dashboardOpen.value;
  sidebarExpanded.value = true;
};

// close on click outside
const clickHandler = ({ target }) => {
  if (!sidebar.value || !trigger.value) return;
  if (!props.sidebarOpen || sidebar.value.contains(target) || trigger.value.contains(target)) return;
  emit('close-sidebar');
};

// close if the esc key is pressed
const keyHandler = ({ keyCode }) => {
  if (!props.sidebarOpen || keyCode !== 27) return;
  emit('close-sidebar');
};

onMounted(() => {
  document.addEventListener('click', clickHandler);
  document.addEventListener('keydown', keyHandler);

  if (sidebarExpanded.value) {
    document.querySelector('body').classList.add('sidebar-expanded');
  } else {
    document.querySelector('body').classList.remove('sidebar-expanded');
  }
});

onUnmounted(() => {
  document.removeEventListener('click', clickHandler);
  document.removeEventListener('keydown', keyHandler);
});

watch(sidebarExpanded, (newValue) => {
  localStorage.setItem('sidebar-expanded', newValue);
  if (newValue) {
    document.querySelector('body').classList.add('sidebar-expanded');
  } else {
    document.querySelector('body').classList.remove('sidebar-expanded');
  }
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
