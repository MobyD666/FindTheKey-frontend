<script setup>
import GuessGrid from '../components/GuessGrid.vue';
import ActionsDisplayInfo from '../components/ActionsDisplayInfo.vue';
import { sendRestart } from '../common/api.js'; 

import { onMounted, inject, defineEmits  } from 'vue';

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


async function restart() 
{
    if (confirm("Are you sure you want to restart the game?"))
    {
    const res=await sendRestart(mainToken);
    emit('reloadBasicInfoNeeded', '');
    }
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
        <button @click="restart()" class="button">Restart the game</button>
    </div>
    </div>
</template>

<style>

</style>