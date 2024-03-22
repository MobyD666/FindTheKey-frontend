<template>
    <div>
      <div class="config-line">
      <label>Keys presented:</label><NumberInput v-model="config.keyspresented" :step="1" :min="1" :max="100" />
      </div>
      <div class="config-line">
            <label>On start:</label><ComboList :options="onStartOptions" v-model="config.onstart" />
      </div>      
      <div class="config-line">
            <label>On correct guess:</label><ComboList :options="onCorrectOptions" v-model="config.oncorrect" />
      </div>      
      <div class="config-line">
            <label>On wrong guess:</label><ComboList :options="onWrongOptions" v-model="config.onwrong" />
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
              <label>On <ComboBox v-model="config.oncustom[index].event" :options="onCustomEventOptions" />&nbsp;<TextInput v-model="config.oncustom[index].detail" v-show="(config.oncustom[index].event=='wheel_of_fortune_turned') || (config.oncustom[index].event=='tasks_task_failed') || (config.oncustom[index].event=='tasks_task_completed') " />:</label>
              <div class="hint" v-if="(onCustomEventHints[item.event] != '') && (onCustomEventHints[item.event] != 'undefined')" >
              {{ onCustomEventHints[item.event] }}
              </div>
              <ComboList :options="onCustomOptions" v-model="config.oncustom[index].actions" />
        </div>
        <div class="config-line-addcustom">
          <button aria-label="Add" @click="addCustom">➕ Add custom event</button>
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

  //const showAdvanced = ref(false);
  //const warnings = ref([]);
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
      return (warns);
      //return((props.basicInfo.role=="wearer")?'You':'Lockee');
    });


  function addCustom() 
  {
    if (props.config.oncustom == undefined) props.config.oncustom=[];
    props.config.oncustom.push({event:"",detail:"",actions:[{ action: 'nothing' }]}); // Add a new item with default values
  }

  const onWrongOptions = 
  [
  { value: 'nothing', text: 'Do Nothing' },
  { value: 'freeze', text: 'Freeze the Lock' },
  { value: 'block', text: 'Block unlocking' },  
  { value: 'addtime', text: 'Add time' },
  { value: 'removetime', text: 'Remove time' },    
  { value: 'change', text: 'Change fake keys',min:0,max:99999 , hint: 'Change x of the fake keys' },
  { value: 'resetkeys', text: 'Change all keys', hint: 'Chance one in x to change all keys (the correct one and all fakes)' },
  { value: 'changekey', text: 'Change the correct key', hint: 'Chance one in x to change the correct key',min:1,max:99999 },  
  { value: 'removeguessedkey', text: 'Remove the guessed key'},
  { value: 'replaceguessedkey', text: 'Replace the guessed key'},
  { value: 'addfakekeys', text: 'Add fake keys', hint: '',min:1,max:100 },    
  { value: 'removefakekeys', text: 'Remove fake keys', hint: '',min:1,max:100 },        
  ];

  const onStartOptions = 
  [
  { value: 'nothing', text: 'Do Nothing' },
  { value: 'freeze', text: 'Freeze the Lock' },
  { value: 'block', text: 'Block unlocking' },  
  { value: 'addtime', text: 'Add time' },
  { value: 'removetime', text: 'Remove time' },  
  
  ];
  
  const onCorrectOptions = 
  [
  { value: 'nothing', text: 'Do Nothing' },
  { value: 'unfreeze', text: 'Unfreeze the Lock' },
  { value: 'unblock', text: 'Allow unlocking' },  
  { value: 'addtime', text: 'Add time' },
  { value: 'removetime', text: 'Remove time' },  
  ];

  const onCustomOptions = 
  [
  { value: 'nothing', text: 'Do Nothing' },
  { value: 'freeze', text: 'Freeze the Lock' },
  { value: 'unfreeze', text: 'Unfreeze the Lock' },  
  { value: 'block', text: 'Block unlocking' },  
  { value: 'unblock', text: 'Allow unlocking' },  
  { value: 'addtime', text: 'Add time' },
  { value: 'removetime', text: 'Remove time' },    
  { value: 'change', text: 'Change fake keys',min:0,max:99999 , hint: 'Change x of the fake keys' },
  { value: 'resetkeys', text: 'Change all keys', hint: 'Chance one in x to change all keys (the correct one and all fakes)' },
  { value: 'changekey', text: 'Change the correct key', hint: 'Chance one in x to change the correct key',min:1,max:99999 },  
  { value: 'addfakekeys', text: 'Add fake keys', hint: '',min:1,max:100 },    
  { value: 'removefakekeys', text: 'Remove fake keys', hint: '',min:1,max:100 },      
  ];

  
  const onCustomEventOptions = 
  [
  { value: 'wheel_of_fortune_turned', text: 'WoF turned' },
  { value: 'tasks_task_completed', text: 'task completed'},
  { value: 'tasks_task_failed', text: 'task failed' },
//  { value: 'dice_rolled', text: 'dice rolled' },
  ]

  const onCustomEventHints=
  {
    wheel_of_fortune_turned:'After Wheel of Fortune turn. Enter the exact text from WoF configuration into the textbox above to trigger only on that result or leave empty for all.',
    tasks_task_completed:'When specific task has been completed. Enter the exact text from task configuration into the textbox above to trigger only on that specifi task or leave empty for all taks.',
    tasks_task_failed:'When specific task has been failed. Enter the exact text from task configuration into the textbox above to trigger only on that specific task or leave empty for all tasks.',
  }
  
  const props = defineProps(
    {
        config: Object
    });
  
  
  
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
</style>
  