<script setup>
import KeyImage from '../components/KeyImage.vue';

import { ref, onMounted, onUnmounted, inject, defineEmits  } from 'vue';

import { sendRestart, sendChange, sendAddFakes, sendUnblock } from '../common/api.js'; 

import NumberInput from '../components/NumberInput.vue';
import Confirmation from '../components/Confirmation.vue';

const emit = defineEmits(['reloadBasicInfoNeeded']);

const props = defineProps(
    {
        basicInfo: Object
    });

let mainToken=null;
let intervalId = null;

onMounted(() => 
{
  mainToken = inject('mainToken');
  intervalId = setInterval(() => reloadBasicInfo() ,60000);
  
});

onUnmounted(() => 
  {
    if (intervalId)  clearInterval(intervalId);
  });

const addfakecount = ref(1);
const removefakecount = ref(1);

const showConfirmation = ref (false);
const confirmationMessage = ref('');

let lastPromise={};

function customConfirm(message) 
{
  return new Promise((resolve, reject) => 
    {
      lastPromise.resolve=resolve;
      lastPromise.reject=reject;
      try
      {
        confirmationMessage.value = message;
        showConfirmation.value = true;
      }
      catch (err)
      {
        console.log(err);
      }
    
  });  
}

async function restart() 
{
  try 
  {
     let confirmed = await customConfirm("Are you sure you want to restart the game?");
     console.log('confirmed: ',confirmed);
     if (confirmed) 
     {
       const res=await sendRestart(mainToken);
       emit('reloadBasicInfoNeeded', ''); //mozna ma byt $this.emit
     }
  } catch (error) { console.log("Error during confirmation dialog",error); }
}

async function unblock() 
{
  try 
  {
    const confirmed = await customConfirm("Are you sure you want to unblock the lock?");
    if (confirmed) 
    {
      const res=await sendUnblock(mainToken);
      emit('reloadBasicInfoNeeded', '');
    }
  } catch (error) { console.log("Error during confirmation dialog",error); }
}

async function changeKey(silent)
{
  try 
  {  
    const confirmed = await customConfirm("Are you sure you want to change the correct key?");
    if (confirmed) 
    {
      const res=await sendChange(mainToken,silent);
      emit('reloadBasicInfoNeeded', '');
    }
  } catch (error) { console.log("Error during confirmation dialog",error); }

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
  
      <Confirmation :message="confirmationMessage" :inplace="false" :show="showConfirmation"  @confirmed="showConfirmation = false;  lastPromise.resolve(true);" @cancelled="showConfirmation = false;  lastPromise.resolve(false);"/>
      <div class="keyholder-line">
      <ActionsDisplayInfo :basicInfo="basicInfo" @reloadBasicInfoNeeded="reloadBasicInfo"/>
      The correct key:
      <KeyImage :keyId="basicInfo.key" />
      <button @click="changeKey(true)" class="button" :disabled="basicInfo.trusted!==true">Change the correct key (silent)</button>
      <button @click="changeKey(false)" class="button">Change the correct key (show in log)</button>
      <div>Total keys displayed (on start): {{ basicInfo.config.keyspresented }}</div>
      <div>Total keys displayed (now): {{ basicInfo.keyspresented }}</div>      
      <div>Keys guessed by the wearer: {{ basicInfo.keysguessed }}</div>            
      <div>Wrong guesses by the wearer: {{ basicInfo.keysguessedwrong }}</div>            
      <div v-show="basicInfo.trusted!==true">Some controls disabled because the keyholder is not trusted by the wearer.</div>
      </div> 
      <div class="keyholder-line">
        <span>Game state: {{ basicInfo.gamestate }}</span>
        <button @click="restart()" class="button" :disabled="basicInfo.trusted!==true">Restart the game</button>
      </div>
      <div class="keyholder-line">
        <header>Add fake keys:</header>
        <NumberInput  v-model="addfakecount"   :step="1" :min="1" :max="100" /><button @click="addFakes(addfakecount,true)" class="button" :disabled="basicInfo.trusted!==true">Add fake keys (silent)</button><button @click="addFakes(addfakecount,false)" class="button">Add fake keys (show in log)</button>
      </div>
      <div class="keyholder-line">  
        <header>Remove fake keys:</header>
        <NumberInput  v-model="removefakecount"   :step="1" :min="1" :max="100" /><button @click="addFakes(-1*removefakecount,true)" class="button" :disabled="basicInfo.trusted!==true">Remove fake keys (silent)</button><button @click="addFakes(-1*removefakecount,false)" class="button">Remove fake keys (show in log)</button>
      </div>  
      <div class="keyholder-line">  
        <header>Fail-safe controls:</header>
        <button @click="unblock()" class="button">Unblock the lock</button>
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