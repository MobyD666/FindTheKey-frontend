<template>
    <div class="DurationSelectorItem duration-item">
        <button v-if="editable" class="duration-btn duration-plus modal-content justify-content-center center-items" @click="onplus">+</button>
        <div class="duration-digits duration-digit">
            <div class="duration-digit">{{ firstdigit }}</div>
            <div class="duration-digit">{{ seconddigit }}</div>
        </div>
        <button v-if="editable" class="duration-btn duration-minus modal-content justify-content-center center-items" @click="onminus">-</button>
        <div class="duration-label">{{namelabel}}</div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits , ref, computed } from 'vue';


  const props = defineProps({
    modelValue: {
      type: Number,
      default: 0
    },
    factor: {
      type: Number,
      default: 1
    },
    editname: {
      type: String,
      default: ""
    },
      editable: {
        type: Boolean,
        default: true
      }

  });

  const firstdigit = computed(() => 
  {
    return(Math.floor(props.modelValue/10));
  });
  const seconddigit = computed(() => 
  {
    return(Math.floor(props.modelValue%10));
  });

  const namelabel = computed(() => 
  {
    return (props.editname+((props.modelValue==1)?"":"s"));
  });

  function onplus()
  {
    emit('update:modelValue', Number(props.factor));
  }

  function onminus()
  {
    emit('update:modelValue', Number(-1*props.factor));
  }


 const emit = defineEmits(['update:modelValue']);


  </script>
  
  <style scoped >

.DurationSelectorItem .duration-btn {
    color: #a4a7b7;
    cursor: pointer;
    padding: .3rem 0;
    text-align: center;
    transition: .15s
}

.DurationSelectorItem .duration-btn:hover {
    color: #fff
}

.modal-content {
    background-clip: padding-box;
    background-color: #28272e;
    border: 0 solid #444;
    border-radius: 25px;
    display: flex;
    flex-direction: column;
    outline: 0;
    pointer-events: auto;
    position: relative;
    width: 100%
}

.justify-content-center {
    justify-content: center!important
}

.center-items
{
    align-items: center;
}

  
  </style>
  