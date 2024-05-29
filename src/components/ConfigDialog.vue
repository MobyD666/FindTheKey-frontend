<template>
    <div>
      <div class="config-line">
        <label>Keys presented:</label><NumberInput v-model="config.keyspresented" :step="1" :min="1" :max="100" />
      </div>
      <div class="config-line">
        <CheckBox v-model="config.hideconfig" label="Hide config details" description="Hide configuration details from lock overview" />
        <div class="config-line-spacer" />
        <CheckBox v-model="config.unfairsenabled" label="Enable unfair actions" description="Allow the lock or keyholder to perform actions that are unfair" />
        <!-- <CheckBox v-model="config.unfairskeyholderonly" label="Restrict to keyholer" description="No random unfairness - it is completely under the control of the keyholder"  v-show="config.unfairsenabled"/>-->
        <span v-show="config.unfairsenabled" class="centered" >
          <label>Unfairness level:</label><ComboBox :options="unfairsleveloptions" v-model="config.unfairslevel" :showall="config.showAdvanced" />
          <div class="hint" v-if="(unfairsleveloptions[config.unfairslevel-1] != undefined) && (unfairsleveloptions[config.unfairslevel-1] != '') && (unfairsleveloptions[config.unfairslevel-1] != 'undefined')" >
          {{ unfairsleveloptions[config.unfairslevel-1].hint }}
          </div>  
        <div class="" v-if="(config.unfairslevel==-1) && (showCustom)">
          <div v-if="showCustom">
            <div class="infotext">
              You can read more in keyholder documentation <a href="https://ext-prod2.techspace.cz/ftk/docs/docs/keyholder" target="_blank">here</a>.
            </div>
            
            <div class="subheader">
              Blockers:
            </div>
            <div v-for="(item, index) in config.startupBlockers" :key="index" class="" >
              <div class="item">
                <BlockerItemKeyholder 
                  :modelValue="item" 
                  @update:modelValue="(newValue) => updateBlockerValue(index, newValue)"
                  @deleteblocker="()=>deleteBlocker(index)"
                  :disabled="false"
                />
              </div>  
            </div>                
                
            
            <div class="buttons-sidebyside" >
              <ComboBox 
                :modelValue="addBlockerType" 
                :options="addBlockerOptions" 
                @update:modelValue="(newValue) => addBlockerType=newValue"
                
              />
              <button aria-label="Add" @click="addBlocker()"  class="standardbutton">➕ Add blocker</button>
            </div>  

            <div class="subheader">
              Global unfairness settings:
            </div>
            <div class="centered" >
              <SliderList :modelValue="startupUnfairSettingsComputed" :enabled="true"  @update:model-value=" (value)=>updateUnfairSettings(value)"/>
            </div>


            <div class="subheader">
              Individual unfairness events:
            </div>
            <span v-for="(item, index) in config.startupUnfairs" :key="index" class="" >
              <div class="item" >
                <UnfairItem 
                  :modelValue="item" 
                  @update:modelValue="(newValue) => updateUnfairValue(index, newValue)"
                  @deleteunfair="()=>deleteUnfair(index)"
                  :disabled="false"
                  :options="addUnfairOptions"
                  :currentguess="1"
                />
              </div>
            </span>

            <div class="buttons-sidebyside">
              <ComboBox 
                :modelValue="addUnfairType" 
                :options="addUnfairOptions" 
                @update:modelValue="(newValue) => addUnfairType=newValue"
              />
              <button aria-label="Add" @click="addUnfair()" class="standardbutton">➕ Add</button>
            </div>

          </div>
        </div>
        <div v-if="(config.unfairslevel==-1) && (config.showAdvanced) && (!showCustom)" class="config-line" >
          Spoiler warning: Setting the custom options will reveal inner workings of the unfairness system. If you want to continue, click this button 
          <button aria-label="Show custom unfairness config" @click="prepareUnfairConfig();showCustom=true;" >Show custom options</button> 
        </div>

      </span>
        
      </div>
      <div class="config-line">
        <label>On start:</label><ComboList :options="onStartOptions" v-model="config.onstart" :showall="config.showAdvanced" />

        <div class="config-line-spacer" />
        <label>On correct guess:</label><ComboList :options="onCorrectOptions" v-model="config.oncorrect" :showall="config.showAdvanced" />
        <div class="config-line-spacer" />
     
        <label>On wrong guess:</label><ComboList :options="onWrongOptions" v-model="config.onwrong" :showall="config.showAdvanced" />
      </div>
      <div class="config-line warning" v-show="warnings.length>0">
        <div v-for="(item,index) in warnings" :key="index">
        Warning: {{item}}
      </div>
      </div>
      <div class="config-line">
        <header>Advanced options</header>
        <button aria-label="Show advanced options" @click="config.showAdvanced=true" v-show="config.showAdvanced!==true">Show advanced options</button>
        <button aria-label="Hide advanced options" @click="config.showAdvanced=false" v-show="config.showAdvanced">Hide advanced options</button>
        <p v-show="config.showAdvanced">These settings provide for more complex extension configuration and thus they are meant for experienced users.</p>
      </div>

      <span v-show="config.showAdvanced">
        <div class="config-line" v-for="(item, index) in config.oncustom" :key="index">
              <label>On <ComboBox v-model="config.oncustom[index].event" :options="onCustomEventOptions" />&nbsp;<NumberInput v-model="config.oncustom[index].detail" v-show="onCustomEventDetails[item.event].showNumberDetail" /><TextInput v-model="config.oncustom[index].detail" v-show="onCustomEventDetails[item.event].showTextDetail" />:</label>
              <div class="hint" v-if="(onCustomEventDetails[item.event].hint != '') && (onCustomEventDetails[item.event].hint != 'undefined')" >
              {{ onCustomEventDetails[item.event].hint }}
              </div>
              <ComboList :options="onCustomOptions" v-model="config.oncustom[index].actions" />
              <button aria-label="Delete event" @click="removeCustom(index)" class="no-border-button">🗑️ Delete custom event</button>
        </div>
        <div class="config-line-addcustom">
          <button aria-label="Add" @click="addCustom">➕ Add custom event</button>
        </div>
        <div class="config-line">
          <CheckBox v-model="config.disableplayerrestart" label="Wearer restart disabled" description="If checked, then the wearer will not be able to restart the minigame after it is finished." />
        </div>
        
      </span>
    </div>

  </template>
  
  <script setup>
  import { ref,computed } from 'vue';

  import ComboBox from '../components/ComboBox.vue';
  import ComboList from '../components/ComboList.vue';
  import NumberInput from '../components/NumberInput.vue';
  import TextInput from '../components/TextInput.vue';
  import CheckBox from '../components/CheckBox.vue';


  
  import SliderList from '../components/SliderList.vue';
  import UnfairItem from '../components/UnfairItem.vue';
  import BlockerItemKeyholder from '../components/BlockerItemKeyholder.vue';
  import {settingsDefs,addBlockerOptions,addUnfairOptions,defaultStartupUnfairSettings} from '../components/UnfairConsts.js';


  const showCustom = ref(false);
  //const warnings = ref([]);

  const startupUnfairSettingsComputed = computed(() => 
  {
      let v=[];
      Object.keys(defaultStartupUnfairSettings.user).forEach (k => 
      {
        v.push(
          {
            key:k,
            name: k, 
            value:props.config.startupUnfairSettings.user[k], 
            description: settingsDefs[k]?.description,
            min:settingsDefs[k]?.min, 
            max:settingsDefs[k]?.max,
            default:defaultStartupUnfairSettings.default[k], 
            type:settingsDefs[k]?.type
          }
        );
      });
      console.log('calculated unfair settings',v);
      return(v);
  });


  const warnings = computed(() => 
    {
      let warns=[];
      let states={};
      props.config.onstart.forEach(a=>states[a.action]=1);
      props.config.onwrong.forEach(a=>states[a.action]=2);
      props.config.oncorrect.forEach(a=>states[a.action]=3);
      if (props.config.oncustom != undefined) props.config.oncustom.forEach(cust=>cust.actions.forEach(a=>states[a.action]=2));
      //console.log(props.config.oncustom);
      if ((states["freeze"]>0) && (!(states["unfreeze"]>=states["freeze"]))) warns.push("You have configured lock freeze, but no unfreeze. If you do not have other means to unfreeze the lock, the lock could be frozen forever.");
      if ((states["block"]>0) && (!(states["unblock"]>=states["block"]))) warns.push("You have configured unlocking blocking, but no removal of the blocking. If you do not have other means to unlock the lock, you could be locked indefinetely even as the timer runs out.");
      //console.log(states);
      //console.log('warns',warns);
      if ((props.config.unfairsenabled) && (! props.config.unfairskeyholderonly))
      {
        if (props.config.unfairslevel>3) 
          warns.push("You have enabled the unfairness and configured its level to higher value. Expect it to severly affect the lock time and your ability to find the correct key.");
        else
          warns.push("You have enabled the unfairness. Expect it to affect the lock time and your ability to find the correct key.");


      }
      return (warns);
      //return((props.basicInfo.role=="wearer")?'You':'Lockee');
    });


  function addCustom() 
  {
    if (props.config.oncustom == undefined) props.config.oncustom=[];
    props.config.oncustom.push({event:"wheel_of_fortune_turned",detail:"",actions:[{ action: 'nothing' }]}); // Add a new item with default values
  }

  function removeCustom(index) 
  {
      props.config.oncustom.splice(index, 1);
  }

  const onWrongOptions = 
  [
  { value: 'nothing', text: 'Do Nothing' },
  { value: 'freeze', text: 'Freeze the Lock' },
  { value: 'unfreeze', text: 'Unfreeze the Lock', hidebydefault:true },
  { value: 'togglefreeze', text: 'Freeze/Unfreeze the Lock' },    
  { value: 'block', text: 'Block unlocking' },  
  { value: 'unblock', text: 'Allow unlocking', hidebydefault:true },  
  { value: 'addtime', text: 'Add time' },
  { value: 'removetime', text: 'Remove time', hidebydefault:true },    
  { value: 'change', text: 'Change fake keys',min:0,max:99999 , hint: 'Change x of the fake keys' },
  { value: 'resetkeys', text: 'Change all keys', hint: 'Chance one in x to change all keys (the correct one and all fakes)' },
  { value: 'changekey', text: 'Change the correct key', hint: 'Chance one in x to change the correct key',min:1,max:99999 },  
  { value: 'removeguessedkey', text: 'Remove the guessed key'},
  { value: 'replaceguessedkey', text: 'Replace the guessed key'},
  { value: 'addfakekeys', text: 'Add fake keys', hint: '',min:1,max:100 },    
  { value: 'removefakekeys', text: 'Remove fake keys', hint: '',min:1,max:100 },
  { value: 'pillory', text: 'Send to pillory', hint: 'Send wearer to the pillory',min:900,max:86400},      
  ];

  const onStartOptions = 
  [
  { value: 'nothing', text: 'Do Nothing' },
  { value: 'freeze', text: 'Freeze the Lock' },
  { value: 'unfreeze', text: 'Unfreeze the Lock' , hidebydefault:true},
  { value: 'togglefreeze', text: 'Freeze/Unfreeze the Lock' , hidebydefault:true },    
  { value: 'unblock', text: 'Allow unlocking' , hidebydefault:true },
  { value: 'block', text: 'Block unlocking' },  
  { value: 'addtime', text: 'Add time' },
  { value: 'removetime', text: 'Remove time' , hidebydefault:true },  
  { value: 'pillory', text: 'Send to pillory', hint: 'Send wearer to the pillory',min:900,max:86400},
  ];
  
  const onCorrectOptions = 
  [
  { value: 'nothing', text: 'Do Nothing' },
  { value: 'unfreeze', text: 'Unfreeze the Lock' },
  { value: 'freeze', text: 'Freeze the Lock', hidebydefault:true },  
  { value: 'togglefreeze', text: 'Freeze/Unfreeze the Lock' },    
  { value: 'unblock', text: 'Allow unlocking' },  
  { value: 'block', text: 'Block unlocking' , hidebydefault:true },  
  { value: 'addtime', text: 'Add time' , hidebydefault:true },
  { value: 'removetime', text: 'Remove time' },  
  { value: 'pillory', text: 'Send to pillory', hint: 'Send wearer to the pillory',min:900,max:86400},  
  { value: 'restartgame', text: 'Restart the game', hint: 'Restarts the whole minigame' },        
  ];

  const onCustomOptions = 
  [
  { value: 'nothing', text: 'Do Nothing' },
  { value: 'freeze', text: 'Freeze the Lock' },
  { value: 'unfreeze', text: 'Unfreeze the Lock' },  
  { value: 'togglefreeze', text: 'Freeze/Unfreeze the Lock' },  
  { value: 'block', text: 'Block unlocking' },  
  { value: 'unblock', text: 'Allow unlocking' },  
  { value: 'addtime', text: 'Add time' },
  { value: 'removetime', text: 'Remove time' },    
  { value: 'change', text: 'Change fake keys',min:0,max:99999 , hint: 'Change x of the fake keys' },
  { value: 'resetkeys', text: 'Change all keys', hint: 'Chance one in x to change all keys (the correct one and all fakes)' },
  { value: 'changekey', text: 'Change the correct key', hint: 'Chance one in x to change the correct key',min:1,max:99999 },  
  { value: 'addfakekeys', text: 'Add fake keys', hint: '',min:1,max:100 },    
  { value: 'removefakekeys', text: 'Remove fake keys', hint: '',min:1,max:100 },      
  { value: 'restartgame', text: 'Restart the game', hint: 'Restarts the whole minigame' },        
  { value: 'pillory', text: 'Send to pillory', hint: 'Send wearer to the pillory',min:900,max:86400},
  ];

  
  const onCustomEventOptions = 
  [
  { value: 'wheel_of_fortune_turned', text: 'WoF turned' },
  { value: 'tasks_task_completed', text: 'task completed'},
  { value: 'tasks_task_failed', text: 'task failed' },
  { value: 'on_guess_every', text: 'every x-th wrong guess' },
  { value: 'on_guess_x', text: 'x-th wrong guess' },
  { value: 'knowablewrong', text: 'knowable wrong guess' },
  { value: 'guess_timer_failed', text: 'guess timer incorrect' },
  { value: 'guess_timer_success', text: 'guess timer correct' },
  { value: 'link_time_changed_removed', text: 'share link time removed' },
  { value: 'link_time_changed_added', text: 'share link time added' },

  
//  { value: 'dice_rolled', text: 'dice rolled' },
  ]

  const onCustomEventDetails=
  {
    wheel_of_fortune_turned:{showTextDetail:true,showNumberDetail:false,hint:'After Wheel of Fortune turn. Enter the exact text from WoF configuration into the textbox above to trigger only on that result or leave empty for all.'},
    tasks_task_completed:{showTextDetail:true,showNumberDetail:false,hint:'When specific task has been completed. Enter the exact text from task configuration into the textbox above to trigger only on that specifi task or leave empty for all taks.'},
    tasks_task_failed:{showTextDetail:true,showNumberDetail:false,hint:'When specific task has been failed. Enter the exact text from task configuration into the textbox above to trigger only on that specific task or leave empty for all tasks.'},
    on_guess_every:{showTextDetail:false,showNumberDetail:true,hint:'On every x-th wrong key guess. On wrong events still apply.'},
    on_guess_x:{showTextDetail:false,showNumberDetail:true,hint:'On exactly x-th wrong key guess. On wrong events still apply but this overrides "on every x-th" would they match both.'},
    knowablewrong:{showTextDetail:false,showNumberDetail:false,hint:'When the user guesses key that was possible to know it was fake.'},
    guess_timer_failed:{showTextDetail:false,showNumberDetail:false,hint:'When the user guesses the timer using Guess the Timer etension and the guess is wrong.'},
    guess_timer_success:{showTextDetail:false,showNumberDetail:false,hint:'When the user guesses the timer using Guess the Timer etension and the guess is correct.'},
    link_time_changed_added:{showTextDetail:false,showNumberDetail:false,hint:'When the user receives add time vote on shared link.'},
    link_time_changed_removed:{showTextDetail:false,showNumberDetail:false,hint:'When the user receives remove time vote on shared link.'},    
    "":{showTextDetail:false,showNumberDetail:false,hint:''},
  }

  const unfairsleveloptions=
  [
  { value: '1', text: 'Little bit unfair', hint: 'Almost fair - only events with very little impact' },
  { value: '2', text: 'Spice it up', hint: 'Causual unfairness' },
  { value: '3', text: 'A bit unfair', hint: 'Medium level of unfairness' },
  { value: '4', text: 'Hurt me plenty', hint: 'Not fair at all' },
  { value: '5', text: 'Absolutely unfair', hint: 'There is no fairness in the world' },
  { value: '-1', text: 'Custom', hint: 'Perfectly customized portion of unfairness', hidebydefault:true },
  ];
  const props = defineProps(
    {
        config: Object
    });
  
  

const addBlockerType = ref ('add_time');

function addBlocker()
{
  let newBlocker={type: addBlockerType.value};
  if (newBlocker.type=='add_time') newBlocker.time=3600;
  console.log('Props pre',props.config);
  props.config.startupBlockers.push(newBlocker);
  console.log(props.config);
}

function deleteBlocker(index)
{
  props.config.startupBlockers.splice(index,1);
 // console.log(localBlockers.value);
}

async function updateBlockerValue(index, newValue)
{
  props.config.startupBlockers[index]=newValue;
}

async function updateUnfairSettings(newValue)
{

   console.log('newValue',newValue);
   newValue.forEach ( (v) => {props.config.startupUnfairSettings.user[v.key]=v.value;} );
   console.log(props.config);
}

function prepareUnfairConfig()
{
  console.log ('Config pre preparation',props.config);
  if (props.config.startupBlockers==undefined) props.config.startupBlockers=[];
  if (props.config.startupUnfairs==undefined) props.config.startupUnfairs=[];
  if (props.config.startupUnfairSettings==undefined) props.config.startupUnfairSettings=defaultStartupUnfairSettings;
  
  
}


function deleteUnfair(index)
{
  props.config.startupUnfairs.splice(index,1);
 // console.log(localUnfairs.value);
}

async function updateUnfairValue(index, newValue)
{
  props.config.startupUnfairs[index]=newValue;
}

const addUnfairType = ref ('hidekeys');

function addUnfair()
{
  let newUnfair={type: addUnfairType.value,guess:1};
  if (newUnfair.type=='delayactions') newUnfair.time=3600;
  props.config.startupUnfairs.push(newUnfair);
}



  
  </script>

<style scoped>

.config-line 
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

.config-line-spacer
{
  height: .1em;
  width: 100%;
  background-color: #4b4646ad;
  margin-top: 0.1em;
  margin-bottom: 0.1em;
}

.warning 
{
  background-color: rgb(221, 139, 9);
  border-bottom-color: rgb(203, 128, 8);
}


.config-line-addcustom
{
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


.hint
{
    color: rgb(139, 139, 139);
    font-size: 85%;
    flex-basis: 100%;
}

.subheader
{
  font-size:120%;
  font-weight:bold;
  text-align: center;
  width: 100%;
  margin-top: 1em;

}

.infotext
{
  font-size:110%;
  text-align: center;
  width: 100%;
  color: #666666;
}

.centered
{
  text-align:center;
}

.buttons-sidebyside
{
  justify-content: center;
}

</style>
  