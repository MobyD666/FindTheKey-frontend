<template>
    <div class="slider-container">
      <input type="range"
             :min="minimum"
             :max="maximum"
             :step="step"
             :value="(modelValue!=null) ? modelValue : defaultvalue"
             @input="$emit('update:modelValue', $event.target.valueAsNumber)"
             :disabled="!enabled"
             class="slider">
      <span class="slider-value" :style="{ width: widthStyle }">{{ (modelValue!=null) ? modelValue : defaultvalue }}</span> 
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    minimum: {
      type: Number,
      required: true
    },
    maximum: {
      type: Number,
      required: true
    },
    enabled: {
      type: Boolean,
      default: true
    },
    modelValue: {
      type: Number,
      required: true
    },
    defaultvalue: {
        type:Number,
        default: null
    },
    step: {
      type: Number,
      required: true
    }
  });

  const widthStyle = computed(() => 
  {
    const widthEm = Math.ceil(Math.log10(props.maximum)); // Calculate log base 10 and format
    return `${widthEm}em`;
  });
  </script>
  
  <style scoped>
  .slider-container {
    display: flex;
    align-items: center;
    color: white;
  }
  
  .slider {
    width: 100%;
    -webkit-appearance: none;
    appearance: none;
    background: #666;
    height: 5px;
    outline: none;
    margin-right: 10px;
  }
  
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    background: #fff;
    border-radius: 50%;
    cursor: pointer;
  }
  
  .slider::-webkit-slider-runnable-track {
    background: #666;
    height: 5px;
    border-radius: 5px;
  }
  
  .slider:disabled {
    opacity: 0.6;
    background: #575757;
  }
  
  .slider:disabled::-webkit-slider-thumb {
    background: #6e6e6e;
  }
  
  .slider:disabled::-webkit-slider-runnable-track {
    background: #888;
  }

  .slider-value
  {
  
  }
  </style>
  