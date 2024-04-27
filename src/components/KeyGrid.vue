<script setup>
import KeyImage from '../components/KeyImage.vue';

import { ref, watch } from 'vue';

const allkeys = ref([]);

const emit = defineEmits(['reloadBasicInfoNeeded','postponeReload','stopReload']);

const props = defineProps(
    {
       keys: Array
    });


</script>

<template>
        <div class="key-grid" >
            <div v-for="(item,index) in keys" :key="index" class="key-grid-cell" >
                <KeyImage :keyId="item" />
            </div>
        </div>
</template>

<style scoped>

.key-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px; /* Adjust the gap between images */
  padding: 10px; /* Optional: Adds some padding around the grid */
  width: 30em;
  max-width: 95%;
}


  

.key-grid-cell {
  width: 100%; /* Make images fill their container */
  height: auto; /* Maintain aspect ratio */
  object-fit: cover; /* Cover the container without losing aspect ratio */
}


</style>