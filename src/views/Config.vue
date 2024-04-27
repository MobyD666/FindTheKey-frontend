<script setup>
   import ConfigDialog from '../components/ConfigDialog.vue';
   import Loader from '../components/Loader.vue';

   import { reactive } from 'vue';
   import { onMounted } from 'vue';
   import { ref,inject } from 'vue';

   import { apiCall, reportCapabilities, enableSaveListener, saveConfig } from '../common/api.js'; 

   const config = ref({});
   const isLoading = ref(true);

    // Function to fetch config data from the backend
    async function fetchConfig() 
    {
        const configurationToken = inject('configurationToken');
        isLoading.value = true;
        try 
        {
            const response = await apiCall('/config',{configurationToken:configurationToken});
            if (response==null) 
            {
                throw new Error('Network response was not ok.');
            }
            //console.log('Config received',response.config);
            config.value = response.config;
        } 
            catch (error) 
        {
            console.error('Failed to fetch config:', error);
            // Handle error (e.g., set an error message, retry logic, etc.)
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
  reportCapabilities();
  const configurationToken = inject('configurationToken');
  enableSaveListener(async function()
    {
        return(await saveConfig(configurationToken,config.value));  
    });
  fetchConfig();
});



</script>

<template>
  <div>
    <div>
      Find the Key is an extension where the goal is to find the correct key from a group of keys. Depending on the configuration, it can be a game of skill, a game of luck, or something in between.
      Documentation is available <a href="https://ext-prod2.techspace.cz/ftk/docs/docs/ftk/" target="_blank">here</a>.
    </div>
    <div v-if="isLoading"><Loader /></div>
    <ConfigDialog v-else v-model:config="config" />
  </div>
</template>

<style>
</style>