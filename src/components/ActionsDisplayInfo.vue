<script setup>
import { computed, onMounted, onUnmounted, defineEmits } from 'vue';
import RemainingTime from '../components/RemainingTime.vue';


const emit = defineEmits(['reloadBasicInfoNeeded']);

const props = defineProps({
    basicInfo: {
    type: [Object], // Accept both string and number types for keyId
    required: true,
  },
});

const roleText = computed(() => {
    return((props.basicInfo.role=="wearer")?'You':'Lockee');
    });


const basicInfoText = computed(() => {
  // Construct the URL to fetch the image based on keyId
  // Adjust the base URL as necessary for your API
  //console.log(props.basicInfo.role);

    if (props.basicInfo.actionsRemaining==-1)
    {
        return(((props.basicInfo.role=="wearer")?'You can':'Lockee can')+' try to guess the correct key without limits.');
    }
    if (props.basicInfo.actionsRemaining>0) 
    {
            return(((props.basicInfo.role=="wearer")?'You can':'Lockee can')+' try to guess the correct key '+props.basicInfo.actionsRemaining+' times.');
    }
    else
    {
        const mins = Math.floor(props.basicInfo.nextActionIn/60);
        const secs = Math.floor(props.basicInfo.nextActionIn%60);
        return(((props.basicInfo.role=="wearer")?'You':'Lockee')+' must wait '+mins+' minute'+((mins>1)?'s':'')+((secs>0)?(' and '+secs+' second'+((secs>1)?'s.':'')):('.')));
    }
    return ('');
  
});

async function updateTimerFromAPI(args={})
{
    emit('reloadBasicInfoNeeded', args);
}

</script>

<template>
    <span v-if="basicInfo.actionsRemaining==-1">{{ roleText }} can try to guess the correct key without limits.</span>
    <span v-if="basicInfo.actionsRemaining>0">{{ roleText }} can try to guess the correct key {{basicInfo.actionsRemaining}} times.</span>    
    <span v-if="basicInfo.actionsRemaining==0">{{ roleText }} must wait <RemainingTime :initialTimeInSeconds="basicInfo.nextActionIn" @timeReached="updateTimerFromAPI" />.</span>    
</template>

<style scoped>
.key-image-container {
  width: 10em;
  height: 10em;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.key-image {
  max-width: 100%;
  max-height: 100%;
  /* Ensures the aspect ratio is maintained */
}
</style>