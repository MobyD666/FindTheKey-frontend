<script setup>
import KeyImage from '../components/KeyImage.vue';
import { getKeyCandidates, sendGuessKey } from '../common/api.js'; 
import { ref, onMounted, inject,watch } from 'vue';

const allkeys = ref([]);
const isLoading = ref(true);
const guessGridVisible = ref(false);
const guessResultVisible = ref(false);
const guessResultLoading = ref(false);
const guessResult = ref(false);
const guessedKey=ref('');

const emit = defineEmits(['reloadBasicInfoNeeded']);

async function fetchKeyCandidates(mainToken)
{
  isLoading.value = true;
  try 
  {
    const response = await getKeyCandidates(mainToken);
    allkeys.value = response.keys;
    guessGridVisible.value = true;
  }
  finally 
  {
      isLoading.value = false;
      //window.parent.postMessage("[iFrameResizerChild]Ready", "*");
      window.dispatchEvent(new Event('resize'));

  }  
}
let mainToken=null;

onMounted(() => 
{
  mainToken = inject('mainToken');
  fetchKeyCandidates(mainToken);
});

async function guessKey(keyid) 
{
  guessGridVisible.value = false;
  guessedKey.value=keyid;
  guessResultLoading.value=true;
  // Logic to handle the guess, using the index
  console.log(`Guessing key for index: ${keyid}`);
  // Additional logic here
  const res=await sendGuessKey(mainToken, keyid);
  guessResultLoading.value=false;
  guessResult.value=res.guess;
  guessResultVisible.value=true;
}

async function guessAgain()
{
    guessResultLoading.value=false;
    guessResultVisible.value=false;
    isLoading.value = true;
    //await fetchKeyCandidates(mainToken);
    emit('reloadBasicInfoNeeded', '');
}


const props = defineProps(
    {
        basicInfo: Object
    });


// Watch for changes in keyhash to reload the key grid if needed
watch(() => props.basicInfo.keyHash, (newKeyHash) => 
  {
    fetchKeyCandidates(mainToken);
   // console.log('Refreshig grid');
  });    
</script>

<template>
    <div v-if="isLoading">Loading...</div>
    <div v-else  >
        <div v-if="guessResultLoading" class="resultloader">
            Verifying your guess, please stand by...
            <KeyImage :keyId="guessedKey" class="rotating" />
        </div>
        <div v-if="guessResultVisible" class="result">
            <div v-if="guessResult" >
                Correct!
            </div>
            <div v-else="guessResult" >
                Wrong!
                <div v-if="basicInfo.gamestate!='finished' &&  ( (basicInfo.actionsRemaining==-1) || (basicInfo.actionsRemaining>1))">
                    <button @click="guessAgain()" class="button">Guess again!</button>
                </div>                
            </div>

        </div>
        <div class="guess-grid" v-if="guessGridVisible">
            <div v-for="(item,index) in allkeys" :key="index" class="guess-grid-cell" >
                <KeyImage :keyId="item" />
                <button @click="guessKey(item)" class="button">Guess Key</button>
            </div>
        </div>
   </div>
</template>

<style scoped>

.guess-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px; /* Adjust the gap between images */
  padding: 10px; /* Optional: Adds some padding around the grid */
  width: 30em;
  max-width: 95%;
}


  

.guess-grid-cell {
  width: 100%; /* Make images fill their container */
  height: auto; /* Maintain aspect ratio */
  object-fit: cover; /* Cover the container without losing aspect ratio */
}

@keyframes rotateClockwise {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.rotating {
  animation: rotateClockwise 2s linear infinite;
}

.result {
    font-size:200%;
    text-align: center;
}

.resultloader
{
    text-align: center;
    display: flex;
    justify-content: center; /* Center horizontally */
    align-items: center; /* Center vertically */
    flex-direction: column;
    gap:1em;
}




</style>