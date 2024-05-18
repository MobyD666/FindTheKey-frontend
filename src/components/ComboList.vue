<template>
    <div class="combolist">
      <div v-for="(item, index) in modelValue" :key="index" class="item-outer">
        <div class="item">
        <ComboBox 
          :modelValue="item.action" 
          :options="options" 
          @update:modelValue="(newValue) => updateValue(index, newValue)"
          :showall="showall"
        />
        <NumberInput v-if="item.number != undefined" :modelValue="item.number" @update:modelValue="(newValue) => updateValueNumber(index, newValue)"  :step="1" :min="minmax[index].min" :max="minmax[index].max" />
        <TimeInput v-if="item.time != undefined" :modelValue="item.time" @update:modelValue="(newValue) => updateValueTime(index, newValue)" :min="minmax[index].min" :max="minmax[index].max"  />            
        <button aria-label="Delete" @click="removeItem(index)" class="no-border-button">🗑️</button>
        </div>
        <div class="hint" v-if="(hint[index] != '') && (hint[index] != 'undefined')" >
          {{ hint[index] }}
        </div>
      </div>
      <button aria-label="Add" @click="addItem">➕ Add action</button>
    </div>
  </template>
  
  <script setup>

  import ComboBox from '../components/ComboBox.vue';
  import NumberInput from '../components/NumberInput.vue';
  import TimeInput from '../components/TimeInput.vue';

  import { ref,computed } from 'vue';
  


  const props = defineProps({
   modelValue: {
     type: Array, 
     default: []
   },
  options: {
    type: Array,
    required: true
  },
  showall: {
    type: Boolean,
    require:false,
    default:false
  }
});

const hint = computed(() =>
{
    let hints=[];
    props.modelValue.forEach( item=>
    {
        let hint='';
        props.options.filter(o=>o.value==item.action).forEach(o=>hint+=o.hint);
        hints.push(hint);
    });
    return(hints);
});

const minmax = computed(() =>
{
    let minmaxes=[];
    props.modelValue.forEach( item=>
    {
        let minmax={min:1,max:9999999999};
        props.options.filter(o=>o.value==item.action).forEach(o=>{minmax.min=o.min,minmax.max=o.max;});
        minmaxes.push(minmax);
    });
    return(minmaxes);
});

  
  function updateValue(index, newValue) 
  {
    //console.log('New value',newValue);
    props.modelValue[index].action = newValue;
    if ((props.modelValue[index].action == 'change' ) || (props.modelValue[index].action == 'changekey' )  || (props.modelValue[index].action == 'resetkeys' ) || (props.modelValue[index].action == 'removefakekeys' )  || (props.modelValue[index].action == 'addfakekeys' ))
    {
      if (props.modelValue[index].number==undefined) props.modelValue[index].number=1;
      props.modelValue[index].time=undefined;
    }
    else if ((props.modelValue[index].action == 'addtime' ) || (props.modelValue[index].action == 'removetime' ) || (props.modelValue[index].action == 'settime' ) || (props.modelValue[index].action == 'pillory' ) )
    {
      props.modelValue[index].number=undefined;        
      if (props.modelValue[index].time==undefined) props.modelValue[index].time=3600;
    }
    else
    {
        props.modelValue[index].number=undefined;
        props.modelValue[index].time=undefined;
    }
  }

  function updateValueNumber(index, newValue) 
  {
    //console.log('New value',newValue);
    props.modelValue[index].number = newValue;
  }

  function updateValueTime(index, newValue) 
  {
    //console.log('New value',newValue);
    props.modelValue[index].time = newValue;
  }
  
  function removeItem(index) 
  {
    props.modelValue.splice(index, 1);
  }
  
  function addItem() 
  {
    props.modelValue.push({ action: 'nothing' }); // Add a new item with default values
  }
  </script>
  
  <style scoped>

.item {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: row;  
}

.item-outer{
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: column;
  margin:0.75em;
}

@media (max-width: 40em) 
{
  .item {
    flex-direction: column;
  }

}

.no-border-button
{
    border: none; 
    background: none; 
    cursor: pointer;
}

.combolist
{
    display: flex;
    align-items: center; /* Align items vertically in the center */
    flex-direction: column; /* Stack items vertically */
    justify-content: start; /* Align items to the start of the container */
    gap: 0.5em;


}

.hint
{
    color: rgb(139, 139, 139);
    font-size: 75%;
    flex-basis: 100%;
}
  
  </style>
  


  