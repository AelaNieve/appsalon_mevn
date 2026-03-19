import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useKanbanStore = defineStore('kanban', () => {
  const cards = ref(JSON.parse(localStorage.getItem('kanban-cards')) || [
    { id: '1', title: 'Tarea inicial', description: 'Descripción de prueba', status: 'Programado' }
  ]);

  const addCard = (status, title, description) => {
    const newCard = {
      id: Date.now().toString(),
      title,
      description,
      status
    };
    cards.value.push(newCard);
    saveToLocalStorage();
  };

  const removeCard = (id) => {
    cards.value = cards.value.filter(card => card.id !== id);
    saveToLocalStorage();
  };

  const moveCard = (id, newStatus) => {
    const card = cards.value.find(c => c.id === id);
    if (card) {
      card.status = newStatus;
      saveToLocalStorage();
    }
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('kanban-cards', JSON.stringify(cards.value));
  };

  const completionPercentage = computed(() => {
    if (cards.value.length === 0) return 0;
    const delivered = cards.value.filter(card => card.status === 'Entregado').length;
    return Math.round((delivered / cards.value.length) * 100);
  });

  const getCardsByStatus = (status) => {
    return computed(() => cards.value.filter(card => card.status === status));
  };

  return {
    cards,
    addCard,
    removeCard,
    moveCard,
    completionPercentage,
    getCardsByStatus
  };
});
