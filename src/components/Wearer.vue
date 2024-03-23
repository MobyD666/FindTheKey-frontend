<script setup>
import GuessGrid from '../components/GuessGrid.vue';
import ActionsDisplayInfo from '../components/ActionsDisplayInfo.vue';
import { sendRestart } from '../common/api.js'; 

import { onMounted, inject, defineEmits, ref  } from 'vue';

import Confirmation from '../components/Confirmation.vue';

const showConfirmation = ref (false);
const confirmationMessage = ref('');

let lastPromise={};

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
       emit('reloadBasicInfoNeeded', ''); 
     }
  } catch (error) { console.log("Error during confirmation dialog",error); }
}  

async function reloadBasicInfo()
{
    emit('reloadBasicInfoNeeded', '');
}
</script>

<template>
  <div class="content-card" style="width:90% !important;">
    <div v-if="basicInfo.gamestate=='started'">
      <ActionsDisplayInfo :basicInfo="basicInfo" @reloadBasicInfoNeeded="reloadBasicInfo"/>
      <GuessGrid v-if="basicInfo.actionsRemaining != 0" :basicInfo="basicInfo"  @reloadBasicInfoNeeded="reloadBasicInfo" />
    </div>  
    <div v-if="basicInfo.gamestate=='finished'">
        <Confirmation :message="confirmationMessage" :inplace="false" :show="showConfirmation"  @confirmed="showConfirmation = false;  lastPromise.resolve(true);" @cancelled="showConfirmation = false;  lastPromise.resolve(false);"/>
        <button @click="restart()" class="button">Restart the game</button>
    </div>
    </div>
</template>

<style>

</style>