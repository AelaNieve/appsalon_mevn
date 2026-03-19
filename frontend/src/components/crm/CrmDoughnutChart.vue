<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import {
  Chart, DoughnutController, ArcElement, Tooltip, Legend
} from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  width: {
    type: Number,
    default: 389
  },
  height: {
    type: Number,
    default: 260
  }
});

const canvas = ref(null);
const legendContainer = ref(null);
let chart = null;

const createChart = () => {
  if (chart) {
    chart.destroy();
  }

  const ctx = canvas.value.getContext('2d');

  chart = new Chart(ctx, {
    type: 'doughnut',
    data: props.data,
    options: {
      cutout: '80%',
      layout: {
        padding: 24,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
          titleColor: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#1f2937',
          bodyColor: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#1f2937',
          borderColor: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
          borderWidth: 1,
        },
      },
      interaction: {
        intersect: false,
        mode: 'nearest',
      },
      animation: {
        duration: 500,
      },
      maintainAspectRatio: false,
      resizeDelay: 200,
    },
    plugins: [{
      id: 'htmlLegend',
      afterUpdate(c) {
        if (!legendContainer.value) return;

        // Clear existing legend
        while (legendContainer.value.firstChild) {
          legendContainer.value.firstChild.remove();
        }

        const items = c.options.plugins.legend.labels.generateLabels(c);

        items.forEach((item) => {
          const li = document.createElement('li');
          li.style.margin = '4px';

          const button = document.createElement('button');
          button.classList.add('flex', 'items-center', 'px-2', 'py-1', 'bg-white', 'dark:bg-gray-700', 'text-gray-500', 'dark:text-gray-400', 'shadow-sm', 'rounded-full', 'text-xs');
          button.style.opacity = item.hidden ? '.3' : '';
          button.onclick = () => {
            c.toggleDataVisibility(item.index);
            c.update();
          };

          const box = document.createElement('span');
          box.style.display = 'block';
          box.style.width = '8px';
          box.style.height = '8px';
          box.style.backgroundColor = item.fillStyle;
          box.style.borderRadius = '4px';
          box.style.marginRight = '8px';
          box.style.pointerEvents = 'none';

          const labelText = document.createTextNode(item.text);

          button.appendChild(box);
          button.appendChild(labelText);
          li.appendChild(button);
          legendContainer.value.appendChild(li);
        });
      }
    }]
  });
};

watch(() => props.data, () => {
  if (chart) {
    chart.data = props.data;
    chart.update();
  }
}, { deep: true });

onMounted(() => {
  createChart();
});

onUnmounted(() => {
  if (chart) {
    chart.destroy();
  }
});

// Watch for dark mode changes
const observer = new MutationObserver(() => {
  if (chart) {
    chart.options.plugins.tooltip.backgroundColor = document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff';
    chart.options.plugins.tooltip.titleColor = document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#1f2937';
    chart.options.plugins.tooltip.bodyColor = document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#1f2937';
    chart.options.plugins.tooltip.borderColor = document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb';
    chart.update();
  }
});

onMounted(() => {
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
});

onUnmounted(() => {
  observer.disconnect();
});
</script>

<template>
  <div class="grow flex flex-col justify-center">
    <div>
      <canvas ref="canvas" :width="width" :height="height"></canvas>
    </div>
    <div class="px-5 pt-2 pb-6">
      <ul ref="legendContainer" class="flex flex-wrap justify-center -m-1"></ul>
    </div>
  </div>
</template>
