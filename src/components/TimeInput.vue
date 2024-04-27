<template>
    <div :class="{'modal-overlay': !inplace, 'inline-overlay': inplace}" v-show="edit">       
        <div :class="{'modal': !inplace, 'inline-modal': inplace}">
            <div class="modal-content">
                <div class="DurationSelector DurationSelector-center-items">
                <TimeDigitsInput                    :editable="editable" :modelValue="Math.floor(modelValue / 86400)" :editname="'day'" :factor="86400" @update:modelValue="(newValue) => updateValue(newValue)"/>
                <TimeDigitsInput                    :editable="editable" :modelValue="(Math.floor((modelValue % 86400)/3600))" :editname="'hour'" :factor="3600" @update:modelValue="(newValue) => updateValue(newValue)" />
                <TimeDigitsInput                    :editable="editable" :modelValue="(Math.floor((modelValue % 3600)/60))" :editname="'minute'" :factor="60" @update:modelValue="(newValue) => updateValue(newValue)" />
                <TimeDigitsInput v-if="showseconds" :editable="editable" :modelValue="Math.floor(modelValue % 60) " :editname="'second'" :factor="1" @update:modelValue="(newValue) => updateValue(newValue)"/>
                </div>
            </div>
        <button @click="edit=false;" class="ok-button">Ok</button>
        </div>
    </div>
    <div v-show="!edit"  :class="{'inplacetext': noneditableinplace}">
        {{  timelabel }} <button @click="edit=true;" class="editbutton" aria-label="Edit" v-show="editable">✎</button>

    </div>
  </template>
  
  <script setup>

  import TimeDigitsInput from '../components/TimeDigitsInput.vue';

  import { defineProps, defineEmits , computed , ref } from 'vue';

  const edit = ref(false);

  const props = defineProps({
      modelValue: {
        type: Number,
        default: 0
      },
      showseconds: {
        type: Boolean,
        default: true
      },
      editable: {
        type: Boolean,
        default: true
      },
      inplace: {
        type: Boolean,
        default: true
      },
      noneditableinplace:{
        type: Boolean,
        default: false
      },
      min: {
        type: Number,
        default: 1
      },
      max: {
      type: Number,
        default: 99999999999
      }
    });


   const emit = defineEmits(['update:modelValue']);

    function updateValue(value) 
    {
        // Emit the 'update:modelValue' event with the new value
        emit('update:modelValue', Number(Math.min(Math.max(props.min,props.modelValue+value),props.max)));
    }

   const timelabel = computed(() => 
    {

        const days = Math.floor(props.modelValue / 86400);
        const hours = Math.floor((props.modelValue % 86400 ) / 3600);
        const minutes = Math.floor((props.modelValue % 3600) / 60);
        const seconds = Math.floor(props.modelValue % 60);
        const times=[];

        if (days > 1) times.push(`${days} days`);
        if (days == 1) times.push(`${days} day`);

        if (hours > 1) times.push(`${hours} hours`);
        if (hours == 1) times.push(`${hours} hour`);

        if (minutes > 1) times.push(`${minutes} minutes`);
        if (minutes == 1) times.push(`${minutes} minute`);    

        if (seconds > 1) times.push(`${seconds} seconds`);
        if (seconds == 1) times.push(`${seconds} second`);  
    
        if (props.modelValue == 0) times.push('0 seconds');

        return(times.join(' and '));
        
    });

    
  
  </script>
  
  <style >
  .DurationSelector {
    display: flex
}

.DurationSelector .DurationSelectorItem {
    margin: 0 5px
}

.DurationSelectorItem {
    align-items: stretch;
    display: flex;
    flex-direction: column;
    min-width: 50px
}

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

.DurationSelectorItem .duration-digits {
    display: flex
}

.DurationSelectorItem .duration-digits .duration-digit {
    align-items: center;
    background-color: #4d4a5e;
    border-radius: 10px;
    display: flex;
    flex-grow: 1;
    font-size: 1.1rem;
    font-weight: 600;
    height: 40px;
    justify-content: center;
    margin: 1px;
    width: 24px
}

.DurationSelectorItem .duration-label {
    color: #a4a7b7;
    font-size: .9rem;
    margin-top: .25em;
    text-align: center
}

.DurationSelector-center-items
{
    align-items: center;
}


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
  height: 12em;
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

.inplacetext
{
  display: inline;
}

  </style>
  