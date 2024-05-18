<template>
    <span class="combo-box">
      <select :value="props.modelValue" @change="onSelectChange">
        <option v-for="option in optionsFiltered" :key="option.value" :value="option.value">
        {{ option.text }}
    </option>
  </select>
    </span>
  </template>
  
  <script setup>
import { faKitchenSet } from '@fortawesome/free-solid-svg-icons';
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number,Object], // This can be expanded to other types if necessary
    default: ''
  },
  options: {
    type: Array,
    required: true
  },
  showall: {
    type: Boolean,
    require:false,
    default:false
  }

});

const emit = defineEmits(['update:modelValue']);

const optionsFiltered = computed(() => 
     ( props.options.filter( o => props.showall || (!(o.hidebydefault===true)) || (o.value==props.modelValue)))
  );

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
  