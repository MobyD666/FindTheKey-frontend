<script setup>

import { onBeforeMount } from 'vue';

import { onMounted , provide } from 'vue';
//import { iframeResizer } from 'iframe-resizer';



onMounted(() => 
{
  //console.log('starting resizer');
  // iframeResizer({
  //   // Options
  //   log: false, // Enable logging for debugging purposes
  //   checkOrigin: false, // Customize according to your security needs
  // });
});


onBeforeMount(() => 
{
  const hash = window.location.hash.substring(1);
  const params = JSON.parse(decodeURIComponent(hash));
  let mainToken=null;
  let configurationToken=null;  
  mainToken = params.mainToken;
  configurationToken = params.partnerConfigurationToken;
  console.log(mainToken,configurationToken);
  provide('mainToken', mainToken);
  provide('configurationToken', configurationToken);

});

</script>

<template>
 <div id="app">
    <router-view></router-view>
  </div>
</template>

<style >

.button {
  background-color: #333; /* Dark background */
  color: #fff; /* Light text */
  border: 2px solid transparent; /* Transparent border that can be colored on hover */
  padding: 10px 20px; /* Adjust padding to fit your design */
  border-radius: 5px; /* Slightly rounded corners */
  cursor: pointer; /* Changes the cursor to a pointer to indicate it's clickable */
  transition: background-color 0.3s, border-color 0.3s; /* Smooth transition for hover effect */
  font-size: 16px; /* Adjust based on your design */
  text-align: center; /* Ensures text is centered */
  display: inline-block; /* Allows setting padding and margins */
  margin: 0 5px; /* Spacing between buttons, if necessary */
}

.button:hover {
  background-color: #444; /* Slightly lighter dark color on hover */
  border-color: #666; /* Subtle border color change */
}

.editbutton
 {
    font-size: 24px; 
    border: none; 
    background: none; 
    cursor: pointer;
 }

</style>
