<script setup>
import { ref, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import CrmSidebar from './crm/CrmSidebar.vue';
import CrmHeader from './crm/CrmHeader.vue';

const sidebarOpen = ref(false);
const route = useRoute();

watch(() => route.path, () => {
  document.querySelector('html').style.scrollBehavior = 'auto';
  window.scroll({ top: 0 });
  document.querySelector('html').style.scrollBehavior = '';
});
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <CrmSidebar :sidebarOpen="sidebarOpen" @close-sidebar="sidebarOpen = false" />

    <!-- Content area -->
    <div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <!-- Site header -->
      <CrmHeader :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="grow bg-gray-100 dark:bg-gray-900">
        <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>
