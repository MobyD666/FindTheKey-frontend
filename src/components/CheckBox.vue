<template>
    <div class="checkbox-container">
      <input 
        type="checkbox" 
        v-model="checked" 
        @change="updateValue" 
        :id="checkboxId" 
        :checked="modelValue"
      />
      <label :for="checkboxId" class="checkbox-label">
        <i :class="iconClass">
        <FontAwesomeIcon icon="check" class="checkbox-check" />
        </i>

        <div class="label-content">
          <span class="main-label">{{ label }}</span>
          <span class="sub-label">{{ description }}</span>
        </div>
      </label>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, computed } from 'vue';
  import { v4 as uuidv4 } from 'uuid'; // Make sure you have uuid installed to generate unique ids

  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { faCheck } from '@fortawesome/free-solid-svg-icons'
  import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faCheck)

  const props = defineProps({
    modelValue: Boolean,
    label: String,
    description: String
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const checkboxId = uuidv4();
  const checked = ref(props.modelValue);
  
  watch(() => props.modelValue, (newValue) => {
    checked.value = newValue;
  });
  
  const updateValue = () => {
    emit('update:modelValue', checked.value);
  };
  
  const iconClass = computed(() => {
    return {
      'icon-checked': checked.value,
      'icon-unchecked': !checked.value
    };
  });
  </script>
  
  <style scoped>
  .checkbox-container {
    display: flex;
    align-items: center;
  }
  
  .checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .label-content {
    display: flex;
    flex-direction: column;
  }
  
  .main-label {
    font-weight: bold;
  }
  
  .sub-label {
    font-size: 0.8rem;
    color: #666;
  }
  
  input[type="checkbox"] 
  {
    opacity: 0;
    position: absolute;
  }
  
 input[type="checkbox"] + label i {
  position: relative;
  left: 0;
  top: 0;
  display: block;
  width: 1.25em;
  height: 1.25em;
  border-radius: 4px;
  transition: background-color 0.3s;
  margin-right: 1em;
  }
  
  .icon-checked {
    background-color: #375a7f; /* Use the color you want for the checked state */
  }
  
  .icon-unchecked {
    background-color: #555E68 ; /* Use the color you want for the unchecked state */
  }

  .checkbox-check
  {
    bottom: -0.15em;
    position: relative;
    left: 0.2em;
    display: block;
  }

  .icon-unchecked > .checkbox-check
  {
    opacity:0;
  }

  
  </style>
  