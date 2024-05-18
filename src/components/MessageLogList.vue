<template>
  <div class="message-log-container">
    <MessageLog
      v-for="(item, index) in displayedMessages"
      :key="item.time" 
      :message="item"
    />
    <div class="button-container"  >
      <button v-if="displayCount < sortedLog.length" @click="showMore">Show More</button>
      &nbsp;
      <button v-if="displayCount < sortedLog.length" @click="showAll">Show All</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import MessageLog from './MessageLog.vue'; // Ensure correct path

const props = defineProps({
  log: Array,
});

const sortedLog = computed(() => {
  return [...props.log].sort((a, b) => b.time - a.time);
});

const displayCount = ref(10);

const displayedMessages = computed(() => {
  return sortedLog.value.slice(0, displayCount.value);
});

const showMore = () => {
  displayCount.value = Math.min(displayCount.value + 10, sortedLog.value.length);
};

const showAll = () => {
  displayCount.value = sortedLog.value.length;
};
</script>

<style scoped>
.message-log-container {
  max-height: 75vh; /* 75% of the viewport height */
  overflow-y: auto; /* Adds a scrollbar when necessary */
  width: 100%;
}

.button-container {
  text-align: center;
  margin-top: 10px;
}

.button-container button {
  margin: 0 5px;
}

</style>
