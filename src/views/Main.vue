<script setup>

import { onMounted,onUnmounted } from 'vue';
import { ref,inject } from 'vue';

import { getBasicInfo, getBasicInfoCacheId } from '../common/api.js'; 

import KeyHolder from '../components/KeyHolder.vue';
import Wearer from '../components/Wearer.vue';

const basicInfo = ref({});
const basicInfoCacheId = ref({cacheId:null});
const isLoading = ref(true);
const isRefreshing = ref(false);


let mainToken = null;

async function handlereloadBasicInfoNeeded()
{
  isRefreshing.value=true;
  fetchBasicInfoCacheId(mainToken);
}



async function fetchBasicInfoCacheId(mainToken)
{
  const response = await getBasicInfoCacheId(mainToken);
  if (response?.cacheId != undefined) 
  {
    if (response.cacheId != basicInfoCacheId.value.cacheId)
    {
      console.log('basicInfoCacheId changed',basicInfoCacheId.value.cacheId,response.cacheId);      
      basicInfoCacheId.value.cacheId=response.cacheId;
      isRefreshing.value = true;
      fetchBasicInfo(mainToken);
    }
  }
  else
  {
    isRefreshing.value = true;
    fetchBasicInfo(mainToken);
  }

}

async function fetchBasicInfo(mainToken)
{
  isLoading.value = true;
  try 
  {
    const response = await getBasicInfo(mainToken);
    basicInfo.value = response;
    basicInfoCacheId.value.cacheId=response.cacheId;
    console.log('Setting cacheId as (source basicinfo) ',response.cacheId);
  }
  finally 
  {
      isLoading.value = false;
      isRefreshing.value = false;
      //window.parent.postMessage("[iFrameResizerChild]Ready", "*");
      window.dispatchEvent(new Event('resize'));

  }  
}

let intervalId = null;

onMounted(() => 
{
  mainToken = inject('mainToken');
  fetchBasicInfo(mainToken);
  intervalId = setInterval( () => fetchBasicInfoCacheId(mainToken) ,30000);
 
});

onUnmounted(() => 
  {
    if (intervalId)  clearInterval(intervalId);
  });

async function handlepostponeReload(value=30000)
{
  if ((value == undefined) || (value < 1) || (value =="")) value=30000;
  if (intervalId)  
    { 
      clearInterval(intervalId);
      intervalId = setInterval( () => fetchBasicInfoCacheId(mainToken) ,value);
    }
}  

async function handlestopReload()
{
  if (intervalId)  clearInterval(intervalId);
}  


</script>

<template>
  <div class="main-container">
    <div v-if="isLoading && !isRefreshing">Loading...</div>
    <div v-else  >
      <span v-if="basicInfo.valid">
        <KeyHolder  v-if="basicInfo.role=='keyholder'" v-model:basicInfo="basicInfo" @reloadBasicInfoNeeded="handlereloadBasicInfoNeeded"/>
        <Wearer  v-if="basicInfo.role=='wearer'" v-model:basicInfo="basicInfo" @reloadBasicInfoNeeded="handlereloadBasicInfoNeeded"  @postponeReload="handlepostponeReload" @stopReload="handlestopReload" />
      </span>
      <span v-else >
        Lock not found
      </span>

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