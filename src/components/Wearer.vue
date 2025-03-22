<script setup>
import GuessGrid from '../components/GuessGrid.vue';
import ActionsDisplayInfo from '../components/ActionsDisplayInfo.vue';
import BlockListWearer from '../components/BlockListWearer.vue';
import { sendRestart } from '../common/api.js'; 

import { onMounted, inject, defineEmits, ref  } from 'vue';

import Confirmation from '../components/Confirmation.vue';

const showConfirmation = ref (false);
const confirmationMessage = ref('');

let lastPromise={};

const emit = defineEmits(['reloadBasicInfoNeeded','postponeReload','stopReload']);

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
       emit('reloadBasicInfoNeeded', {}); 
     }
  } catch (error) { console.log("Error during confirmation dialog",error); }
}  

async function reloadBasicInfo(args={})
{
  emit('reloadBasicInfoNeeded', args);
}

async function postponeReload()
{
  emit('postponeReload', '');
}

async function stopReload()
{
  emit('stopReload', '');
}




</script>

<template>
  <div class="content-card" style="width:90% !important;">
    <div v-if="basicInfo.gamestate=='started' || basicInfo.gamestate==undefined">
      <ActionsDisplayInfo :basicInfo="basicInfo" @reloadBasicInfoNeeded="reloadBasicInfo"/>
      <BlockListWearer :blocks="basicInfo.blocks" v-if="basicInfo.blocks.length>0" :seed="basicInfo.seed" />
      <div v-if="basicInfo.blocks.length==0">
        <GuessGrid v-if="basicInfo.actionsRemaining != 0" :basicInfo="basicInfo"  @reloadBasicInfoNeeded="reloadBasicInfo" @postponeReload="postponeReload" @stopReload="stopReload"/>
      </div>
    </div>  
    <div v-if="basicInfo.gamestate=='finished'">
        <Confirmation :message="confirmationMessage" :inplace="false" :show="showConfirmation"  @confirmed="showConfirmation = false;  lastPromise.resolve(true);" @cancelled="showConfirmation = false;  lastPromise.resolve(false);"/>
        You have found the correct key!<br/>
        <button @click="restart()" class="button" v-if="basicInfo.disableplayerrestart != true">Restart the game</button>
    </div>
    </div>
</template>

<style>

</style>