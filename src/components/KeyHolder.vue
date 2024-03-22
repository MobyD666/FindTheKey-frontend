<script setup>
import KeyImage from '../components/KeyImage.vue';

import { ref, onMounted, inject, defineEmits  } from 'vue';

import { sendRestart, sendChange, sendAddFakes } from '../common/api.js'; 

import NumberInput from '../components/NumberInput.vue';

const emit = defineEmits(['reloadBasicInfoNeeded']);

const props = defineProps(
    {
        basicInfo: Object
    });

let mainToken=null;

onMounted(() => 
{
  mainToken = inject('mainToken');
});

const addfakecount = ref(1);
const removefakecount = ref(1);

async function restart() 
{
  if (confirm("Are you sure you want to restart the game?"))
  {
    const res=await sendRestart(mainToken);
    emit('reloadBasicInfoNeeded', '');
  }
}

async function changeKey(silent)
{
  if (confirm("Are you sure you want to change the correct key?"))
  {
    const res=await sendChange(mainToken,silent);
    emit('reloadBasicInfoNeeded', '');
  }
}

async function addFakes(count,silent)
{
    const res=await sendAddFakes(mainToken,count,silent);
    emit('reloadBasicInfoNeeded', '');
}

async function reloadBasicInfo()
{
  emit('reloadBasicInfoNeeded', '');
}
</script>

<template>
  
    
      <div class="keyholder-line">
      <ActionsDisplayInfo :basicInfo="basicInfo" @reloadBasicInfoNeeded="reloadBasicInfo"/>
      The correct key:
      <KeyImage :keyId="basicInfo.key" />
      <button @click="changeKey(true)" class="button">Change the correct key (silent)</button>
      <button @click="changeKey(false)" class="button">Change the correct key (show in log)</button>
      <div>Total keys displayed (on start): {{ basicInfo.config.keyspresented }}</div>
      <div>Total keys displayed (now): {{ basicInfo.keyspresented }}</div>      
      </div> 
      <div class="keyholder-line">
        <span>Game state: {{ basicInfo.gamestate }}</span>
        <button @click="restart()" class="button">Restart the game</button>
      </div>
      <div class="keyholder-line">
        <header>Add fake keys:</header>
        <NumberInput  v-model="addfakecount"   :step="1" :min="1" :max="100" /><button @click="addFakes(addfakecount,true)" class="button">Add fake keys (silent)</button><button @click="addFakes(addfakecount,false)" class="button">Add fake keys (show in log)</button>
      </div>
      <div class="keyholder-line">  
        <header>Remove fake keys:</header>
        <NumberInput  v-model="removefakecount"   :step="1" :min="1" :max="100" /><button @click="addFakes(-1*removefakecount,true)" class="button">Remove fake keys (silent)</button><button @click="addFakes(-1*removefakecount,false)" class="button">Remove fake keys (show in log)</button>
      </div>  
    
</template>

<style>
.keyholder-line .button
{
  margin:0.2em;
}

.keyholder-line 
{
    background-color: #343241;
    border-radius: 30px;
    box-shadow: 0 4px 8px rgba(0,0,0,.2);
    padding-left: 1em;
    padding-right: 1em;
    padding-top: 0.3em;
    padding-bottom: 0.3em;
    margin:1em;
    margin-top:2em;

    display: flex;
    align-items: center; /* Align items vertically in the center */
    flex-direction: column; /* Stack items vertically */
    justify-content: start; /* Align items to the start of the container */
    gap: 1em; /* Space between label and input */


}
</style>