<script setup>

import { onMounted } from 'vue';
import { ref,inject } from 'vue';

import { getBasicInfo } from '../common/api.js'; 

import KeyHolder from '../components/KeyHolder.vue';
import Wearer from '../components/Wearer.vue';

const basicInfo = ref({});
const isLoading = ref(true);

let mainToken = null;

async function handlereloadBasicInfoNeeded()
{
  fetchBasicInfo(mainToken);
}

async function fetchBasicInfo(mainToken)
{
  isLoading.value = true;
  try 
  {
    const response = await getBasicInfo(mainToken);
    basicInfo.value = response;
  }
  finally 
  {
      isLoading.value = false;
      //window.parent.postMessage("[iFrameResizerChild]Ready", "*");
      window.dispatchEvent(new Event('resize'));

  }  
}

onMounted(() => 
{
  mainToken = inject('mainToken');
  fetchBasicInfo(mainToken);
});


</script>

<template>
  <div class="main-container">
    <div v-if="isLoading">Loading...</div>
    <div v-else  >
      <KeyHolder  v-if="basicInfo.role=='keyholder'" v-model:basicInfo="basicInfo" @reloadBasicInfoNeeded="handlereloadBasicInfoNeeded"/>
      <Wearer  v-if="basicInfo.role=='wearer'" v-model:basicInfo="basicInfo" @reloadBasicInfoNeeded="handlereloadBasicInfoNeeded" />
    </div>
  </div>
</template>

<style>
.main-container {
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically (if needed) */
  height: 100%; /* Ensure it has a height if you want vertical centering */
}


.content-card 
{
  background-color: #343241;
  border-radius: 30px;
  box-shadow: 0 4px 8px rgba(0,0,0,.2);
  padding: 1.25em;
  width:20em;
  max-width:95vw;
}

@media (max-width: 40em) 
{
}

</style>