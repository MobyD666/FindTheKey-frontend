<script setup>
import { computed } from 'vue';
const props = defineProps({
  keyId: {
    type: [String, Number], // Accept both string and number types for keyId
    required: true,
  },
});

const imageUrl = computed(() => {
  // Construct the URL to fetch the image based on keyId
  // Adjust the base URL as necessary for your API
  return `/ftk/key/${props.keyId}`;
});
</script>

<template>
  <div class="key-image-container">
    <img :src="imageUrl" alt="Key Image" v-if="imageUrl" class="key-image" />
  </div>
</template>

<style scoped>
.key-image-container {
  width: 10em;
  height: 10em;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.key-image {
  max-width: 100%;
  max-height: 100%;
  /* Ensures the aspect ratio is maintained */
}
</style>