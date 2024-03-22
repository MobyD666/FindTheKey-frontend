<template>
      <input type="edit" :value="modelValue" @input="updateValue($event.target.value)" class="text-input">
  </template>
  
  <script>
  export default {
    name: 'TextInput',
    props: {
      modelValue: {
        type: String,
        default: ''
      },
     
    },
    methods: {
      updateValue(value) {
        // Emit the 'update:modelValue' event with the new value
        this.$emit('update:modelValue', value);
      }
    }
  };
  </script>
  
  <style scoped>
 
  .text-input  {
    text-align: center;
    padding: 0.5em;
    border: 1px solid #ccc;
    width: 6em; /* Adjust width as needed */
  }
  </style>
  