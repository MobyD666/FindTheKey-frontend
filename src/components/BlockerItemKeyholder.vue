<template>
    <div v-if="modelValue.type=='add_time'">
        Wearer must add at least  <TimeInput v-if="modelValue.time != undefined" :modelValue="modelValue.time" @update:modelValue="(newValue) => updateValueTime(newValue)" :editable="! disabled" :noneditableinplace="true"  /> at once to be able to guess.
            <button aria-label="Delete" @click="deleteBlocker()" class="no-border-button" v-show="! disabled">🗑️</button>            
    </div>
    <div v-if="modelValue.type=='freeze'">
        Wearer cannot guess when the lock is frozen. 
            <button aria-label="Delete" @click="deleteBlocker()" class="no-border-button" v-show="! disabled">🗑️</button>            
    </div>    
    <div v-if="modelValue.type=='verification'">
        Wearer cannot guess until verification photo is submitted. 
            <button aria-label="Delete" @click="deleteBlocker()" class="no-border-button" v-show="! disabled">🗑️</button>            
    </div>    

    <div v-if="modelValue.type=='shared_link'">
        Wearer cannot guess until there is a vote on a shared link. 
            <button aria-label="Delete" @click="deleteBlocker()" class="no-border-button" v-show="! disabled">🗑️</button>            
    </div>        
    <div v-if="modelValue.type=='turn_wheel_of_fortune'">
        Wearer must turn the Wheel of Fortune to be able to guess. 
            <button aria-label="Delete" @click="deleteBlocker()" class="no-border-button" v-show="! disabled">🗑️</button>            
    </div>            
    <div v-if="modelValue.type=='task_completed'">
        Wearer must complete a task to be able to guess. 
            <button aria-label="Delete" @click="deleteBlocker()" class="no-border-button" v-show="! disabled">🗑️</button>            
    </div>            
    <div v-if="modelValue.type=='task_failed'">
      Wearer must fail a task to be able to guess.
            <button aria-label="Delete" @click="deleteBlocker()" class="no-border-button" v-show="! disabled">🗑️</button>            
    </div>            

    <div v-if="modelValue.type=='jigsaw_complete'">
      Wearer must complete a jigsaw puzzle to be able to guess.
            <button aria-label="Delete" @click="deleteBlocker()" class="no-border-button" v-show="! disabled">🗑️</button>            
    </div>      
    


  </template>
  
  <script setup>
import { defineProps, defineEmits } from 'vue';

import TimeInput from '../components/TimeInput.vue';

const props = defineProps({
  modelValue: {
    type: [Object], // This can be expanded to other types if necessary
    default: ''
  },
  disabled: {
    type:Boolean,
    default: false
  }
  
});

const emit = defineEmits(['update:modelValue','deleteblocker']);

function onSelectChange(event) {
  // Emit the 'update:modelValue' event when the selection changes
  emit('update:modelValue', event.target.value);
}

function updateValueTime(newValue)
{
    props.modelValue.time=newValue;
    let newBlocker=props.modelValue;
    newBlocker.time=newValue;
    //emit('update:modelValue', newBlocker);
}

function deleteBlocker()
{
    emit('deleteblocker', null);
}
</script>
  
  <style scoped>
  
  
  .no-border-button
{
    border: none; 
    background: none; 
    cursor: pointer;
}

  </style>
  