<template>
  <div class="item">
    <div class="sidebyside biggertext">
      {{ option.text }}
      <TimeInput v-if="modelValue.time != undefined" :modelValue="modelValue.time" @update:modelValue="(newValue) => updateValueTime(newValue)" :editable="! disabled" :noneditableinplace="true"  />

    </div>
    <div class="sidebyside">

      Guess: Exactly <NumberInput v-model="modelValue.guess" :disabled="disabled" :min="currentguess" />
      or from <NumberInput v-model="modelValue.guessmin" :disabled="disabled" />
      to <NumberInput v-model="modelValue.guessmax" :disabled="disabled" />
    </div>
    
    <div class="sidebyside">
            
    <button aria-label="Delete" @click="deleteUnfair()" class="no-border-button" v-show="! disabled">🗑️</button>
    </div>
  </div>
  </template>
  
  <script setup>
import { defineProps, defineEmits, computed } from 'vue';

import NumberInput from '../components/NumberInput.vue';
import TimeInput from '../components/TimeInput.vue';

const props = defineProps({
  modelValue: {
    type: [Object], // This can be expanded to other types if necessary
    default: ''
  },
  disabled: {
    type:Boolean,
    default: false
  },
  options: {
    type: Array,
    default: []
  },
  currentguess: {
    type: Number,
    default: 0

  }
  
});

const emit = defineEmits(['update:modelValue','deleteunfair']);



function deleteUnfair()
{
    emit('deleteunfair', null);
}

function updateValueTime(newValue)
{
    props.modelValue.time=newValue;
    let newBlocker=props.modelValue;
    newBlocker.time=newValue;
    //emit('update:modelValue', newBlocker);
}

const option = computed(() =>
{
    return ( props.options.find ( (o)=> o.value == props.modelValue.type) );
}
);
</script>
  
  <style scoped>
  
  .no-border-button
{
    border: none; 
    background: none; 
    cursor: pointer;
}
  
.sidebyside 
{

    display: flex;
    flex-direction: row;
    align-items: center; /* Align items vertically in the center */
    justify-content: start; /* Align items to the start of the container */
    gap: 1em; /* Space between label and input */


} 

.item 
{
  border: 1px solid black;
  padding:0.5em;
  margin:0.1em;
  display: flex;
  flex-direction: column;
  align-items: center; /* Align items vertically in the center */
  justify-content: start; /* Align items to the start of the container */
  gap: 1em; 

  border-radius: 15px;
}

.biggertext
{
  size:1.2rem;
  font-weight: bold;
}


  </style>
  