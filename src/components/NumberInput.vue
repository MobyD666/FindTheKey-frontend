<template>
    <span class="number-input">
      
      <input type="number" :value="modelValue" @input="updateValue($event.target.value)" :min="min" :max="max">
      <button @click="decrement">-</button>
      &nbsp;
      <button @click="increment">+</button>
    </span>
  </template>
  
  <script>
  export default {
    name: 'NumberInput',
    props: {
      modelValue: {
        type: Number,
        default: 0
      },
      step: {
        type: Number,
        default: 1
      },
      min: {
        type: Number,
        default: 1
      },
      max: {
      type: Number,
        default: 99999
      }
    },
    methods: {
      updateValue(value) {
        // Emit the 'update:modelValue' event with the new value
        this.$emit('update:modelValue', Number(value));
      },
      increment() {
        this.updateValue(Math.min(this.max,this.modelValue + this.step));
      },
      decrement() {
        this.updateValue(Math.max(this.min,this.modelValue - this.step));
      }
    }
  };
  </script>
  
  <style scoped>
  .number-input {
    display: flex;
    align-items: center;
  }
  
  .number-input button {
    padding: 0.5em;
    border: 1px solid #ccc;
    background-color: #000000;
    cursor: pointer;
  }
  
  .number-input input[type="number"] {
    text-align: center;
    padding: 0.5em;
    border: 1px solid #ccc;
    width: 4em; /* Adjust width as needed */
  }
  </style>
  