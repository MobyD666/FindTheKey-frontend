<template>
    <span>
      {{ timeString }}
    </span>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, watch, defineEmits } from 'vue';
  
  // Props to receive the initial time from the parent component
  const props = defineProps({
    initialTimeInSeconds: Number, // Initial time in seconds
  });
  
  const remainingTime = ref(props.initialTimeInSeconds);
  const timeString = ref('');
  
  // Convert remaining time in seconds to a human-readable format
  function updateTimeString() {
    const hours = Math.floor(remainingTime.value / 3600);
    const minutes = Math.floor((remainingTime.value % 3600) / 60);
    const seconds = Math.floor(remainingTime.value % 60);
    if (remainingTime.value >= 1)
    {
      const times=[];
      if (hours > 1) times.push(`${hours} hours`);
      if (hours == 1) times.push(`${hours} hour`);

      if (minutes > 1) times.push(`${minutes} minutes`);
      if (minutes == 1) times.push(`${minutes} minute`);    

      if (seconds > 1) times.push(`${seconds} seconds`);
      if (seconds == 1) times.push(`${seconds} second`);  
      
      timeString.value=times.join(' and ');
    }
    else if (remainingTime.value < 1) timeString.value = 'a few seconds';

    
    //timeString.value = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  const emit = defineEmits(['timeReached']);
  
  let intervalId = null;
  
  onMounted(() => {
    updateTimeString();
    intervalId = setInterval(() => 
    {
      if (remainingTime.value > 0) 
      {
        remainingTime.value--;
        updateTimeString();
      } else 
      {
        clearInterval(intervalId);
        setTimeout( () => {emit('timeReached');console.log('emit');} , 3000);
      }
  
      // Emit event every 5 minutes (300 seconds)
      if (Math.floor(remainingTime.value % 300) === 0) 
      {
        emit('timeReached',{force:true});
        
      }
    }, 1000);
  });
  
  onUnmounted(() => 
  {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });
  
  // Watch for changes in initialTimeInSeconds prop to reset the timer
  watch(() => props.initialTimeInSeconds, (newTime) => 
  {
    remainingTime.value = newTime+1;
    updateTimeString();
  });
  </script>
  