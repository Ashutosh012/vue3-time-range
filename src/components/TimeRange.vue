<template>
    <div class="time-picker-container">
        <button @click="toggleTimePicker" class="time-input-button">Select Time</button>
        <div v-if="showTimePicker" class="time-dropdown" @click.stop ref="timePicker">
            <div v-for="time in timeSlots" :key="time" :data-time="time"
                :class="['time-slot', { 'time-slot-disabled': !isActiveTime(time), 'time-slot-active': isActiveTime(time) }]"
                @click="selectTime(time)">
                {{ time }}
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

interface TimeRange {
    start: string;
    end: string;
}

const showTimePicker = ref(false);
const selectedTime = ref('');
const timePicker = ref<HTMLDivElement | null>(null);
const activeTimeRanges: TimeRange[] = [
    { start: '10:00', end: '13:00' },
    { start: '16:00', end: '18:00' },
];
const timeSlots = ref<string[]>([]);

const getCurrentTimeIST = () => {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

const isActiveTime = (time: string): boolean => {
    const now = getCurrentTimeIST();
    const currentDateStr = now.toISOString().split('T')[0]; // 'YYYY-MM-DD' format
    const currentTime = now.getHours() * 60 + now.getMinutes(); // current time in minutes
    return activeTimeRanges.some((range) => {
        const [startHour, startMinutes] = range.start.split(':').map(Number);
        const [endHour, endMinutes] = range.end.split(':').map(Number);
        const [timeHour, timeMinutes] = time.split(':').map(Number);
        const rangeDateStr = (startHour <= endHour) ? currentDateStr : addDays(currentDateStr, 1); // add a day if the range spans over midnight
        const isToday = rangeDateStr === currentDateStr;
        const startTime = startHour * 60 + startMinutes;
        const endTime = endHour * 60 + endMinutes;
        const slotTime = timeHour * 60 + timeMinutes;

        const isActive = slotTime >= startTime && slotTime <= endTime;
        const isPast = isToday && slotTime < currentTime;
        
        return isActive && !isPast;
    });
}

const addDays = (dateStr: string, days: number): string => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

const populateTimeSlots = () => {
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            timeSlots.value.push(time);
        }
    }
}

const selectTime = (time: string) => {
    if (isActiveTime(time)) {
        selectedTime.value = time;
        showTimePicker.value = false;
    }
}

const toggleTimePicker = () => {
    showTimePicker.value = !showTimePicker.value;

    if (showTimePicker.value) {
        nextTick(() => {
            scrollToCurrentTime();
        });
    }
}

const scrollToCurrentTime = () => {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const currentHour = now.getHours();
    const currentMinutes = Math.floor(now.getMinutes() / 30) * 30;
    const currentTimeSlot = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;

    const currentTimeElement = timePicker.value?.querySelector(`[data-time="${currentTimeSlot}"]`);

    if (currentTimeElement) {
        currentTimeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

onMounted(populateTimeSlots);
</script>
  
<style>
.time-picker-container {
    position: relative;
    width: 200px;
}

.time-input-button {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
}

.time-dropdown {
    position: absolute;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
}

.time-slot {
    padding: 10px;
    border-bottom: 1px solid #eee;
    text-align: center;
}

.time-slot:last-child {
    border-bottom: none;
}

.time-slot-active {
    background-color: #f0f0f0;
}

.time-slot-disabled {
    color: #ccc;
    pointer-events: none;
}

.time-slot:not(.time-slot-disabled):hover {
    background-color: #e7e7e7;
    cursor: pointer;
}
</style>