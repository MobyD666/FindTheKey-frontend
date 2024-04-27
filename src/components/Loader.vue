<template>
    <div class="loader">
      <FontAwesomeIcon icon="fa-lock"  class="fa fa-lock-hb" />
    </div>
  </template>
  
  <script setup>
      import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { faLock } from '@fortawesome/free-solid-svg-icons'
  import { library } from '@fortawesome/fontawesome-svg-core'

  library.add(faLock);
  </script>
  
  <style scoped>
  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* Adjust the height as needed or as per your UI design */
  }
  
  .fa-lock {
    font-size: 48px; /* Adjust size as needed */
    animation: spin 2s infinite linear;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }



.fa-lock-hb {
  font-size: 48px; /* Adjust size as needed */
  color: rgb(220, 220, 220); /* Heartbeat color, adjust as needed */
  animation: heartbeat 1.5s infinite;
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.2);
  }
  50% {
    transform: scale(0.8);
  }
  75% {
    transform: scale(1.2);
  }
}
  </style>
  