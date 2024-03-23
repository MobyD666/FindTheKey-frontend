<script setup>

import { ref, inject, defineEmits  } from 'vue';

const emit = defineEmits(['confirmed','cancelled']);

const props = defineProps(
    {
        message: String,
        show: 
        {
            type: Boolean,
            default: false
        },
        inplace: 
        {
            type: Boolean,
            default: true
        }
    });

function confirm() 
{
    emit('confirmed', '');
}

function cancel() 
{
    emit('cancelled', '');
}

</script>

<template>
    <div :class="{'modal-overlay': !inplace, 'inline-overlay': inplace}" v-show="show">       
        <div :class="{'modal': !inplace, 'inline-modal': inplace}">
            <div class="modal-content">
                {{ message }}
            </div>
        <button @click="cancel()" class="cancel-button">Cancel</button>
        <button @click="confirm()" class="ok-button">Ok</button>
        </div>
    </div>
</template>

<style scoped>

.modal-overlay {
  position: fixed; /* Cover the entire screen */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center; /* Center the modal horizontally */
  align-items: center; /* Center the modal vertically */
  z-index: 1000; /* Ensure it's above other content */
  backdrop-filter: blur(5px); /* Apply a blur effect to the background */
}

.modal {
  width: 15em;
  height: 6em;
  background-color: #343241;
  border-radius: 1.5em;
  position: relative; /* Positioning context for the OK button */
  padding: 1em; /* Padding around the modal content */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Optional: adds shadow for depth */
  display: flex; /* Use flexbox for internal layout */
  flex-direction: column; /* Stack children vertically */
  justify-content: center; /* Center children vertically */
}

.modal-content {
  text-align: center; /* Center the text/content horizontally */
  /* Additional styles for your main content as needed */
}

.ok-button 
{
  position: absolute; /* Position the button relative to the modal */
  right: 1em; /* Position from the right */
  bottom: 1em; /* Position from the bottom */
  /* Style your button as needed */
}

.cancel-button 
{
  position: absolute; /* Position the button relative to the modal */
  right: 4em; /* Position from the right */
  bottom: 1em; /* Position from the bottom */
  /* Style your button as needed */
}

.inline-overlay 
{
  /* Styles for when the modal should be displayed inline */
  /* This might be as simple as normal flow if no specific styles are needed */
}

.inline-modal 
{
  width: 15em;
  height: 12em;
  background-color: #343241;
  border-radius: 1.5em;
  position: relative; /* Positioning context for the OK button */
  padding: 1em; /* Padding around the modal content */
  box-shadow: 4px 4px 8px #000000; /* Optional: adds shadow for depth */
  display: flex; /* Use flexbox for internal layout */
  flex-direction: column; /* Stack children vertically */
  justify-content: center; /* Center children vertically */
}
</style>