<template>
    <span class="combo-box">
      <select :value="props.modelValue" @change="onSelectChange">
        <option v-for="option in props.options" :key="option.value" :value="option.value">
        {{ option.text }}
    </option>
  </select>
    </span>
  </template>
  
  <script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number,Object], // This can be expanded to other types if necessary
    default: ''
  },
  options: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

function onSelectChange(event) {
  // Emit the 'update:modelValue' event when the selection changes
  emit('update:modelValue', event.target.value);
}
</script>
  
  <style scoped>
  /* Basic styles, adjust as needed */
  .combo-box select {
    padding: 0.5em;
    border-radius: 0.25em;
    border: 1px solid #ccc;
  }

  
  

  </style>
  