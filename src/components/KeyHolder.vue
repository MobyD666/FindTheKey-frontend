<script setup>
import KeyImage from '../components/KeyImage.vue';

import { ref, onMounted, onUnmounted, inject, defineEmits, computed ,watch, watchEffect } from 'vue';

import { sendRestart, sendChange, sendAddFakes, sendUnblock , sendBlockers , sendUnfairs ,sendUnfairSettings } from '../common/api.js'; 

import SliderList from '../components/SliderList.vue';
import NumberInput from '../components/NumberInput.vue';
import Confirmation from '../components/Confirmation.vue';
import KeyGrid from '../components/KeyGrid.vue';
import UnfairItem from '../components/UnfairItem.vue';
import BlockerItemKeyholder from '../components/BlockerItemKeyholder.vue';
import ComboBox from '../components/ComboBox.vue';

const emit = defineEmits(['reloadBasicInfoNeeded','restartReload']);

const props = defineProps(
    {
        basicInfo: Object
    });

let mainToken=null;
let intervalId = null;

onMounted(() => 
{
  mainToken = inject('mainToken');
  intervalId = setInterval(() => reloadBasicInfo() ,60000);
  
});

onUnmounted(() => 
  {
    if (intervalId)  clearInterval(intervalId);
  });

const addfakecount = ref(1);
const removefakecount = ref(1);

const showConfirmation = ref (false);
const confirmationMessage = ref('');

const showKnowableFakes = ref (false);

const localBlockers = ref ([]);
const blockersEdit = ref (false);

const addBlockerType = ref ('add_time');

const localUnfairs = ref ([]);
const unfairsEdit = ref (false);

const addUnfairType = ref ('hidekeys');

const localUnfairSettings = ref ({});
const unfairSettingsEdit = ref (false);

const showUnfairSettings = ref (false);
const showUnfairs = ref (false);
const showBlockers = ref (false);

const settingsDefs = 
{
  unabletoguess: {min:0,max:100,type:'slider',description:'Unable to guess %'},
  delayactions: {min:0,max:100,type:'slider',description:'Delay actions %'},
  hidekeys: {min:0,max:100,type:'slider',description:'Hide keys %'},
  doubleactions: {min:0,max:100,type:'slider',description:'Double actions %'},
  twins: {min:0,max:100,type:'slider',description:'Twins %'},
  nocorrectkey: {min:0,max:100,type:'slider',description:'No correct key %'},
  liecorrect: {min:0,max:100,type:'slider',description:'Lie correct %'},
  blocktime: {min:0,max:100,type:'slider',description:'Add time blocker %'},
  blocktime_time: {min:0,max:8640000,type:'time',description:'Add time blocker mean time'},
  delayactions_time: {min:0,max:8640000,type:'time',description:'Delay actions mean time'},
  blockverification: {min:0,max:100,type:'slider',description:'Verification blocker %'},
  blockshared_link: {min:0,max:100,type:'slider',description:'Shared link blocker %'},
  blockturn_wheel_of_fortune: {min:0,max:100,type:'slider',description:'WoF blocker %'},
  blocktask_completed: {min:0,max:100,type:'slider',description:'Task completed blocker %'},
  blocktask_failed: {min:0,max:100,type:'slider',description:'Task failed blocker %'},

};

/*
const sl = ref ([
{ name: 'add_time', value:null, description: 'Add time',min:0, max:100,default:10},
{ name: 'freeze', value:40, description: 'Freeze',min:0, max:100,default:10},
{ name: 'verification', value:null, description: 'Verification',min:0, max:100,default:10},
]);
*/

let lastPromise={};

// Watch for changes in blockers to copy them to local copy if not editing
watchEffect(() => 
  {
    //console.log('Blockers watch',props.basicInfo.blockers, 'blockersEdit',blockersEdit.value);
    if (!(blockersEdit.value)) localBlockers.value = JSON.parse(JSON.stringify(props.basicInfo.blockers));
   
  });    

// Watch for changes in unfairs to copy them to local copy if not editing
watchEffect(() => 
  {
    //console.log('Blockers watch',props.basicInfo.blockers, 'blockersEdit',blockersEdit.value);
    if (!(unfairsEdit.value)) 
    {
      let unfairsReceived=JSON.parse(JSON.stringify(props.basicInfo.unfairs));
      unfairsReceived=unfairsReceived.map( (u) => { u.guess+=1;u.guessMax+=1;u.gessMin+=1; return(u);} )
      localUnfairs.value = unfairsReceived;
    }
   
  });  


// Watch for changes in unfairs settings to copy them to local copy if not editing
watchEffect(() => 
  {
    //console.log('Blockers watch',props.basicInfo.blockers, 'blockersEdit',blockersEdit.value);
    if (!(unfairSettingsEdit.value)) 
    {
      let settingsReceived=JSON.parse(JSON.stringify(props.basicInfo.unfairSettings));
      let v=[];
      Object.keys(settingsReceived.user).forEach (k => 
      {
        v.push(
          {
            key:k,
            name: k, 
            value:settingsReceived.user[k], 
            description: settingsDefs[k]?.description,
            min:settingsDefs[k]?.min, 
            max:settingsDefs[k]?.max,
            default:settingsReceived.default[k], 
            type:settingsDefs[k]?.type
          }
        );
      });
      localUnfairSettings.value = v;
    }
   
  });    

function customConfirm(message) 
{
  return new Promise((resolve, reject) => 
    {
      lastPromise.resolve=resolve;
      lastPromise.reject=reject;
      try
      {
        confirmationMessage.value = message;
        showConfirmation.value = true;
      }
      catch (err)
      {
        console.log(err);
      }
    
  });  
}

async function restart() 
{
  try 
  {
     let confirmed = await customConfirm("Are you sure you want to restart the game?");
     console.log('confirmed: ',confirmed);
     if (confirmed) 
     {
       const res=await sendRestart(mainToken);
       emit('reloadBasicInfoNeeded', ''); //mozna ma byt $this.emit
     }
  } catch (error) { console.log("Error during confirmation dialog",error); }
}

async function unblock() 
{
  try 
  {
    const confirmed = await customConfirm("Are you sure you want to unblock the lock?");
    if (confirmed) 
    {
      const res=await sendUnblock(mainToken);
      emit('reloadBasicInfoNeeded', '');
    }
  } catch (error) { console.log("Error during confirmation dialog",error); }
}

async function changeKey(silent)
{
  try 
  {  
    const confirmed = await customConfirm("Are you sure you want to change the correct key?");
    if (confirmed) 
    {
      const res=await sendChange(mainToken,silent);
      emit('reloadBasicInfoNeeded', '');
    }
  } catch (error) { console.log("Error during confirmation dialog",error); }

}

async function addFakes(count,silent)
{
    const res=await sendAddFakes(mainToken,count,silent);
    emit('reloadBasicInfoNeeded', '');
}

async function reloadBasicInfo()
{
  emit('reloadBasicInfoNeeded', '');
}

function deleteBlocker(index)
{
  let b=localBlockers.value;
  b.splice(index,1);
  localBlockers.value=b;
 // console.log(localBlockers.value);
}

async function updateBlockerValue(index, newValue)
{
  localBlockers[index]=newValue;
}

async function saveBlockers()
{
  try 
  { 
    const res=await sendBlockers(mainToken,localBlockers.value);

  } catch (error) { console.log("Error during sendBlockers",error); }

  emit('reloadBasicInfoNeeded', '');
  blockersEdit.value=false;
}

function cancelBlockers()
{
  localBlockers.value=JSON.parse(JSON.stringify(props.basicInfo.blockers));
  blockersEdit.value=false;
  
}

function addBlocker()
{
  let newBlocker={type: addBlockerType.value};
  if (newBlocker.type=='add_time') newBlocker.time=3600;
  localBlockers.value.push(newBlocker);
}

function cancelUnfairSettings()
{
  unfairSettingsEdit.value=false;
}

async function saveUnfairSettings()
{
  try 
  { 
    let s={};
    Object.keys(localUnfairSettings.value).forEach ( (k) => s[localUnfairSettings.value[k].key] = localUnfairSettings.value[k].value);
    const res=await sendUnfairSettings(mainToken,s);

  } catch (error) { console.log("Error during sendUnfairSettings",error); }

  emit('reloadBasicInfoNeeded', '');  
  unfairSettingsEdit.value=false;
}

async function updateUnfairSettings(newValue)
{
  localUnfairSettings.value=newValue;
}




function deleteUnfair(index)
{
  let b=localUnfairs.value;
  b.splice(index,1);
  localUnfairs.value=b;
 // console.log(localUnfairs.value);
}

async function updateUnfairValue(index, newValue)
{
  localUnfairs[index]=newValue;
}

async function saveUnfairs()
{
  try 
  { 
    let unfairsToSend = localUnfairs.value;
    unfairsToSend=unfairsToSend.map( (u) => { u.guess-=1;u.guessMax-=1;u.gessMin-=1; return(u);});

    const res=await sendUnfairs(mainToken,unfairsToSend);

  } catch (error) { console.log("Error during sendUnfairs",error); }

  emit('reloadBasicInfoNeeded', '');
  unfairsEdit.value=false;
}

function cancelUnfairs()
{
  localUnfairs.value=JSON.parse(JSON.stringify(props.basicInfo.unfairs));
  unfairsEdit.value=false;
  
}

function addUnfair()
{
  let newUnfair={type: addUnfairType.value,guess:props.basicInfo.keysguessed+1};
  if (newUnfair.type=='delayactions') newUnfair.time=3600;
  localUnfairs.value.push(newUnfair);
}

const unfairs = computed(() =>
{
    let unfairs=[];
    let guessNumber=props?.basicInfo?.keysguessed;
    if ((props?.basicInfo?.unfairs != undefined) && (guessNumber != undefined))
    {
      unfairs=props.basicInfo.unfairs.filter(u=>   (u.guess==guessNumber) || ((u.guessmin != undefined) && (u.guessmax != undefined) && (u.guessmin<=guessNumber) && (u.guessmax>=guessNumber)) );
      unfairs.sort((a, b) => ((a.guess==undefined)?a.guessMin:a.guess) - ((b.guess==undefined)?b.guessMin:b.guess));      
    }
    
    return(unfairs);
});

const addBlockerOptions=
[
  { value: 'add_time', text: 'Add Time' },
  { value: 'freeze', text: 'Freeze' },
  { value: 'verification', text: 'Verify lock' },
  { value: 'shared_link', text: 'Get shared link vote' },
  { value: 'turn_wheel_of_fortune', text: 'Turn WoF' },
  { value: 'task_completed', text: 'Complete task' },
  { value: 'task_failed', text: 'Fail task' },
  { value: 'jigsaw_complete', text: 'Complete jigsaw' },

];

const addUnfairOptions=
[
  { value: 'unabletoguess', text: 'Unable to guess' },
  { value: 'liecorrect', text: 'Lie if correct' },
  { value: 'hidekeys', text: 'Hide keys' },
  { value: 'doubleactions', text: 'Double actions' },
  { value: 'twins', text: 'Twins' },
  { value: 'nocorrectkey', text: 'No correct key' },
  { value: 'delayactions', text: 'Delay on correct actions' },
];

</script>

<template>
  
      <Confirmation :message="confirmationMessage" :inplace="false" :show="showConfirmation"  @confirmed="showConfirmation = false;  lastPromise.resolve(true);" @cancelled="showConfirmation = false;  lastPromise.resolve(false);"/>
      
      <div class="keyholder-line">
      <p>Keyholder specific documentation is available <a href="https://ext-prod2.techspace.cz/ftk/docs/docs/keyholder" target="_blank">here</a>.</p>
      <div class="keyholder-line-spacer" />
      <ActionsDisplayInfo :basicInfo="basicInfo" @reloadBasicInfoNeeded="reloadBasicInfo"/>
      The correct key:
      <KeyImage :keyId="basicInfo.key" />
      <button @click="changeKey(true)" class="button" :disabled="basicInfo.trusted!==true">Change the correct key (silent)</button>
      <button @click="changeKey(false)" class="button">Change the correct key (show in log)</button>
      <div>Total keys displayed (on start): {{ basicInfo.config.keyspresented }}</div>
      <div>Total keys displayed (now): {{ basicInfo.keyspresented }}</div>      
      <div>Keys guessed by the wearer: {{ basicInfo.keysguessed }}</div>            
      <div>Wrong guesses by the wearer: {{ basicInfo.keysguessedwrong }}</div>            
      <div v-show="basicInfo.trusted!==true">Some controls disabled because the keyholder is not trusted by the wearer.</div>
      <div class="keyholder-line-spacer" />
      <span>Game state: {{ basicInfo.gamestate }}</span>
      <button @click="restart()" class="button" :disabled="basicInfo.trusted!==true">Restart the game</button>
      </div>
      <div class="keyholder-line">
        <header>Add fake keys:</header>
        <NumberInput  v-model="addfakecount"   :step="1" :min="1" :max="100" /><button @click="addFakes(addfakecount,true)" class="button" :disabled="basicInfo.trusted!==true">Add fake keys (silent)</button><button @click="addFakes(addfakecount,false)" class="button">Add fake keys (show in log)</button>
        <div class="keyholder-line-spacer" />
        <header>Remove fake keys:</header>
        <NumberInput  v-model="removefakecount"   :step="1" :min="1" :max="100" /><button @click="addFakes(-1*removefakecount,true)" class="button" :disabled="basicInfo.trusted!==true">Remove fake keys (silent)</button><button @click="addFakes(-1*removefakecount,false)" class="button">Remove fake keys (show in log)</button>
      </div>  
      <div class="keyholder-line" v-if="basicInfo.knownablewrongs">
        Keys that wearer could have known are fake:  

        <button aria-label="Show known fakes" @click="showKnowableFakes=true" v-show="showKnowableFakes!==true">Show keys</button>
        <button aria-label="Hide known fakes" @click="showKnowableFakes=false" v-show="showKnowableFakes">Hide keys</button>
        <KeyGrid :keys="basicInfo.knownablewrongs"  v-if="showKnowableFakes"/>
      </div>
      <div class="keyholder-line" > 
        <div class="buttons-sidebyside">Guess blockers:
          <button aria-label="Show guess blockers" @click="showBlockers=true" v-show="showBlockers!==true">Show</button>
          <button aria-label="Hide guess blockers" @click="showBlockers=false" v-show="showBlockers">Hide</button>
        </div>
        <div v-for="(item, index) in localBlockers" :key="index" class="" v-show="showBlockers">
          <div class="item">
            <BlockerItemKeyholder 
              :modelValue="item" 
              @update:modelValue="(newValue) => updateBlockerValue(index, newValue)"
              @deleteblocker="()=>deleteBlocker(index)"
              :disabled="(basicInfo.trusted!==true) || (!blockersEdit)"
            />
            
          </div>
        </div>
        <div class="buttons-sidebyside" v-show="showBlockers">
          <ComboBox 
            :modelValue="addBlockerType" 
            :options="addBlockerOptions" 
            @update:modelValue="(newValue) => addBlockerType=newValue"
            v-show="blockersEdit"
          />
          <button aria-label="Add" @click="addBlocker()" v-show="blockersEdit" class="standardbutton">➕ Add blocker</button>
        </div>
        <button aria-label="Edit blockers" @click="blockersEdit=true" v-show="!blockersEdit && showBlockers" >Edit blockers</button>
        <div class="buttons-sidebyside" v-show="showBlockers">
          <button aria-label="Cancel edits" @click="cancelBlockers();" v-show="blockersEdit" class="standardbutton cancelbutton" >Cancel edits</button>
          <button aria-label="Save blockers" @click="saveBlockers()" v-show="blockersEdit"  class="standardbutton okbutton">Save blockers</button>
        </div>
        
        <div class="keyholder-line-spacer" />
        <div class="buttons-sidebyside">
          Global unfairness settings:
          <button aria-label="Show unfair settings" @click="showUnfairSettings=true" v-show="showUnfairSettings!==true">Show</button>
          <button aria-label="Hide unfair settings" @click="showUnfairSettings=false" v-show="showUnfairSettings">Hide</button>
        </div>
        <div class="centered" v-show="showUnfairSettings">
          <SliderList :modelValue="localUnfairSettings" :enabled="(basicInfo.trusted==true) && (unfairSettingsEdit)"  @update:model-value=" (value)=>updateUnfairSettings(value)"/>
          <button aria-label="Edit settings" @click="unfairSettingsEdit=true" v-show="!unfairSettingsEdit" >Edit unfair settings</button>
          <div class="buttons-sidebyside">
            <button aria-label="Cancel edits" @click="cancelUnfairSettings();" v-show="unfairSettingsEdit" class="standardbutton cancelbutton" >Cancel edits</button>
            <button aria-label="Save unfair events" @click="saveUnfairSettings()" v-show="unfairSettingsEdit"  class="standardbutton okbutton">Save unfair events</button>
          </div>
        </div>
        <div class="keyholder-line-spacer" />
        <div class="buttons-sidebyside">
          Individual unfair events: (next guess {{ basicInfo.keysguessed+1 }})
          <button aria-label="Show unfair events" @click="showUnfairs=true" v-show="showUnfairs!==true">Show</button>
          <button aria-label="Hide unfair events" @click="showUnfairs=false" v-show="showUnfairs">Hide</button>
        </div>
        <div v-show="showUnfairs" class="centered">

            <span v-for="(item, index) in localUnfairs" :key="index" class="" v-show="(item.guess>=basicInfo.keysguessed+1) || ( item.guessMax >= basicInfo.keysguessed+1  )">
              <div class="item" >
                <UnfairItem 
                  :modelValue="item" 
                  @update:modelValue="(newValue) => updateUnfairValue(index, newValue)"
                  @deleteunfair="()=>deleteUnfair(index)"
                  :disabled="(basicInfo.trusted!==true) || (!unfairsEdit)"
                  :options="addUnfairOptions"
                  :currentguess="basicInfo.keysguessed+1"
                />
              </div>
            </span>

            <div class="buttons-sidebyside">
              <ComboBox 
                :modelValue="addUnfairType" 
                :options="addUnfairOptions" 
                @update:modelValue="(newValue) => addUnfairType=newValue"
                v-show="unfairsEdit"
              />
              <button aria-label="Add" @click="addUnfair()" v-show="unfairsEdit" class="standardbutton">➕ Add</button>
            </div>
            <button aria-label="Edit blockers" @click="unfairsEdit=true" v-show="!unfairsEdit" >Edit unfair events</button>
            <div class="buttons-sidebyside">
              <button aria-label="Cancel edits" @click="cancelUnfairs();" v-show="unfairsEdit" class="standardbutton cancelbutton" >Cancel edits</button>
              <button aria-label="Save unfair events" @click="saveUnfairs()" v-show="unfairsEdit"  class="standardbutton okbutton">Save unfair events</button>
            </div>
        </div>



      </div>
      <div class="keyholder-line">  
        <header>Fail-safe controls:</header>
        <button @click="unblock()" class="button">Unblock the lock</button>
      </div>  
    
</template>

<style>
.keyholder-line .button
{
  margin:0.2em;
}

.keyholder-line 
{
    background-color: #343241;
    border-radius: 30px;
    box-shadow: 0 4px 8px rgba(0,0,0,.2);
    padding-left: 1em;
    padding-right: 1em;
    padding-top: 0.3em;
    padding-bottom: 0.3em;
    margin:1em;
    margin-top:2em;

    display: flex;
    align-items: center; /* Align items vertically in the center */
    flex-direction: column; /* Stack items vertically */
    justify-content: start; /* Align items to the start of the container */
    gap: 1em; /* Space between label and input */


}

.centered
{
    
    display: flex;
    align-items: center; /* Align items vertically in the center */
    flex-direction: column; /* Stack items vertically */
    justify-content: start; /* Align items to the start of the container */
    

}

.keyholder-line-spacer
{
  height: .1em;
  width: 100%;
  background-color: #4b4646ad;
  margin-top: 0.1em;
  margin-bottom: 0.1em;
}

.no-border-button
{
    border: none; 
    background: none; 
    cursor: pointer;
}

.buttons-sidebyside 
{

    display: flex;
    flex-direction: row;
    align-items: center; /* Align items vertically in the center */
    justify-content: start; /* Align items to the start of the container */
    gap: 1em; /* Space between label and input */


}

.standardbutton
{
  font-size:1.2rem;
}

.cancelbutton
{
  background-color: #343241;
}

.okbutton
{
  background-color: #165117;
}


</style>