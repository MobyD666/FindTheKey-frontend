<template>
    <div class="slider-list">
      <div class="slider-item" v-for="(item, index) in sliders" :key="index">
        <p>{{ item.description }} <button @click="toggleSlider(index)" :disabled="! enabled">{{ item.enabled ? 'Use default' : 'Customize' }}</button></p>
        <slider v-if="item.type=='slider'" :enabled="item.enabled && enabled" :min="item.min" :max="item.max" :model-value="item.value" @update:model-value="value => updateValue(value, index)" :defaultvalue="item.default" />
        <TimeInput v-if="item.type=='time'" :model-value="(item.value!=null)?item.value:item.default" @update:modelValue="(value) => updateValue(value, index)" :editable="item.enabled && enabled" :noneditableinplace="true"  />
      </div>
    </div>
  </template>


<script setup>
import { ref, watch, computed } from 'vue';
import Slider from '../components/Slider.vue';
import TimeInput from '../components/TimeInput.vue';

const props = defineProps({
  modelValue: Array,
  enabled: Boolean
});

const emit = defineEmits(['update:modelValue']);

// Reactive copy of input data to manage internally
const sliders = ref(props.modelValue.map(slider => (
    {
        ...slider,
        enabled: slider.value !== null,
        lastNonNullValue: slider.value || slider.default
    })));

function toggleSlider(index) 
{
  let slider = sliders.value[index];
  if (slider.enabled) 
  {
    slider.value = null;
    slider.enabled = false;
  } else 
  {
    slider.enabled = true;
    // Ensure we keep using the last non-null value or the default
    slider.value = slider.lastNonNullValue || slider.default;
  }
  emitUpdate();
}

function updateValue(newValue, index) 
{
  sliders.value[index].value = newValue;
  sliders.value[index].lastNonNullValue = newValue;
  emitUpdate();
}

function emitUpdate() 
{
  emit('update:modelValue', sliders.value.map(s => ({
    ...s,
    value: s.enabled ? s.value : null
  })));
}

watch(props.modelValue, (newVal) => {
  // Sync internal state if the parent changes the input
  sliders.value = newVal.map(slider => ({
    ...slider,
    enabled: slider.value !== null,
    lastNonNullValue: slider.value || slider.default
  }));
}, { deep: true });
</script>



<style scoped>
.slider-list 
{
  display: flex;
  flex-direction: column;
  gap: 20px;

}

.slider-item 
{
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
