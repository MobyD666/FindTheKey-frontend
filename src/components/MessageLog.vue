<template>
    <div class="message-log">
      <div class="icon">
        <font-awesome-icon :icon="['fas', message.icon]" class="custom-icon" />
      </div>
      <div class="content">
        <div class="header">
          <span class="time">{{ formattedTime }}</span>
          <span class="source">{{ capitalizedSource }}</span>
        </div>
        <div class="message">
          {{ message.message }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { library } from '@fortawesome/fontawesome-svg-core'
  //import { faKey } from '@fortawesome/free-solid-svg-icons'
  import { findIconDefinition, icon } from '@fortawesome/fontawesome-svg-core'
  
  import { fas } from '@fortawesome/free-solid-svg-icons'

  // This adds all solid icons to the library
  library.add(fas);
  
  
  const props = defineProps({
    message: {
      type: Object,
      required: true
    }
  });

  
  const formattedTime = computed(() => {
    const date = new Date(props.message.time)
    return date.toLocaleString()
  });

  const capitalizedSource = computed(() => {
  return props.message.source.charAt(0).toUpperCase() + props.message.source.slice(1)
   });
  </script>
  
  <style scoped>
  .message-log {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 0.1em solid #4b4646ad;
    width:90%;
  }
  
  .icon {
    margin-right: 1em;
  }
  
  .content {
    flex: 1;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    color: #555;
  }
  
  .time {
    margin-right: 10px;
  }
  
  .message {
    margin-top: 5px;
  }

  .custom-icon {
    font-size: 1.3em; /* Adjust size as needed */
    height: 1.3em;
  }
  </style>
  