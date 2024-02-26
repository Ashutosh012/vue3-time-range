<template>
  <div class="time-picker">
    <select v-model="selectedHour">
      <option v-for="hour in filteredHours" :value="hour.value" :disabled="hour.disabled" :key="hour.value">
        {{ hour.text }}
      </option>
    </select>
    :
    <select v-model="selectedMinute">
      <option v-for="minute in minutes" :value="minute" :key="minute">
        {{ minute }}                                                                                                                                                                                                                                          
      </option>
    </select>
    <select v-model="selectedAmpm"> 
      <option value="AM">AM</option>
      <option value="PM">PM</option>
    </select>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const selectedHour = ref(null);
const selectedMinute = ref(null);
const selectedAmpm = ref('AM');

const activeRanges = [
  { start: 10, end: 13, ampm: 'AM' }, // 10AM to 1PM
  { start: 16, end: 18, ampm: 'PM' }  // 4PM to 6PM, in 24-hour format for easier comparison
];

const isActiveHour = (hour, ampm) => {
  return activeRanges.some(range => {
    const adjustedHour = ampm === 'PM' ? hour + 12 : hour;
    if (range.ampm !== ampm) return false;
    return adjustedHour >= range.start && adjustedHour <= range.end;
  });
};

const hours = computed(() => Array.from({ length: 12 }, (_, i) => ({
  value: i + 1, // 1 to 12
  text: `${i + 1}`,
})));

const filteredHours = computed(() => {
  return hours.value.map(hour => ({
    ...hour,
    disabled: !isActiveHour(hour.value, selectedAmpm.value),
  }));
});

const minutes = computed(() => Array.from({ length: 60 }, (_, i) => i < 10 ? `0${i}` : i.toString()));
</script>

<style scoped>
.time-picker {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
}

.time-picker select {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
}
</style>
