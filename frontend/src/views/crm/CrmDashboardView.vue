<script setup>
import { computed, ref } from 'vue';
import draggable from 'vuedraggable';
import { useKanbanStore } from '../../stores/kanban';
import CrmDoughnutChart from '../../components/crm/CrmDoughnutChart.vue';
import CrmDatePicker from '../../components/crm/CrmDatePicker.vue';

const kanbanStore = useKanbanStore();

const statuses = ['Programado', 'Encamino', 'Entregado'];

const programadoCards = computed({
  get: () => kanbanStore.cards.filter(c => c.status === 'Programado'),
  set: (newList) => {
    newList.forEach(card => {
      if (card.status !== 'Programado') kanbanStore.moveCard(card.id, 'Programado');
    });
  }
});

const encaminoCards = computed({
  get: () => kanbanStore.cards.filter(c => c.status === 'Encamino'),
  set: (newList) => {
    newList.forEach(card => {
      if (card.status !== 'Encamino') kanbanStore.moveCard(card.id, 'Encamino');
    });
  }
});

const entregadoCards = computed({
  get: () => kanbanStore.cards.filter(c => c.status === 'Entregado'),
  set: (newList) => {
    newList.forEach(card => {
      if (card.status !== 'Entregado') kanbanStore.moveCard(card.id, 'Entregado');
    });
  }
});

const columns = {
  'Programado': programadoCards,
  'Encamino': encaminoCards,
  'Entregado': entregadoCards
};

const newCard = ref({
  title: '',
  description: '',
  status: 'Programado',
  showModal: false
});

const openAddModal = (status) => {
  newCard.value.status = status;
  newCard.value.title = '';
  newCard.value.description = '';
  newCard.value.showModal = true;
};

const addCard = () => {
  if (newCard.value.title.trim()) {
    kanbanStore.addCard(newCard.value.status, newCard.value.title, newCard.value.description);
    newCard.value.showModal = false;
  }
};

const chartData = computed(() => {
  const total = kanbanStore.cards.length;
  const delivered = kanbanStore.cards.filter(c => c.status === 'Entregado').length;
  const remaining = total - delivered;

  return {
    labels: ['Entregado', 'Restante'],
    datasets: [
      {
        label: 'Progreso de Entregas',
        data: [delivered, remaining],
        backgroundColor: ['#10b981', '#6366f1'],
        hoverBackgroundColor: ['#059669', '#4f46e5'],
        borderWidth: 0,
      },
    ],
  };
});
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="sm:flex sm:justify-between sm:items-center mb-8">
      <!-- Left: Title -->
      <div class="mb-4 sm:mb-0">
        <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
          Gestión de Entregas (OMS)
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Monitorea el progreso de tus servicios en tiempo real.</p>
      </div>

      <!-- Right: Actions -->
      <div class="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
        <!-- Datepicker -->
        <CrmDatePicker align="right" />
      </div>
    </div>

    <!-- Row 1: Status / Chart -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div v-if="kanbanStore.cards.length === 0" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">No hay tareas programadas</h2>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Comienza agregando una nueva tarea en las columnas de abajo.</p>
      </div>

      <div v-else-if="kanbanStore.completionPercentage === 100" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
          <span class="text-4xl">🎯</span>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">¡Todas las entregas completadas!</h2>
        <p class="text-green-600 dark:text-green-400 font-medium mt-1">Buen trabajo, el tablero está al día.</p>
      </div>

      <div v-else class="flex flex-col md:flex-row items-center justify-around">
        <div class="text-center md:text-left mb-6 md:mb-0">
          <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Progreso General</h2>
          <div class="text-5xl font-black text-indigo-600 dark:text-indigo-400">
            {{ kanbanStore.completionPercentage }}%
          </div>
          <p class="text-gray-500 dark:text-gray-400 mt-2">de tareas finalizadas</p>
        </div>
        <div class="w-64 h-64">
          <CrmDoughnutChart :data="chartData" :width="250" :height="250" />
        </div>
      </div>
    </div>

    <!-- Row 2: Kanban Columns -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="status in statuses" :key="status" class="flex flex-col h-full">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider text-sm">
            {{ status }}
            <span class="ml-2 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-xs">
              {{ columns[status].value.length }}
            </span>
          </h3>
          <button
            @click="openAddModal(status)"
            class="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <draggable
          class="flex-1 space-y-4 min-h-[200px] p-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800"
          v-model="columns[status].value"
          group="kanban"
          item-key="id"
        >
          <template #item="{ element }">
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-move hover:shadow-md transition-shadow group relative">
              <button
                @click="kanbanStore.removeCard(element.id)"
                class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h4 class="font-bold text-gray-800 dark:text-gray-100 mb-1">{{ element.title }}</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{{ element.description }}</p>
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <!-- Add Card Modal -->
    <div v-if="newCard.showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 w-full max-w-md p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Nueva Tarea en {{ newCard.status }}</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
            <input
              v-model="newCard.title"
              type="text"
              placeholder="Ej: Entrega de pedido #123"
              class="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
            <textarea
              v-model="newCard.description"
              rows="3"
              placeholder="Detalles adicionales..."
              class="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
            ></textarea>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="newCard.showModal = false"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="addCard"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/30 transition-all"
          >
            Crear Tarea
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
