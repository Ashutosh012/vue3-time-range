<template>
    <div class="relative">
        <button @click="toggleDropdown" class="px-4 py-2 bg-gray-200 rounded-lg focus:outline-none focus:shadow-outline">
            <span>Select Time</span>
        </button>
        
        <div 
            v-if="showDropdown" 
            class="absolute mt-1 flex"
        >
            <div 
                class="bg-white rounded-md shadow-lg z-10 scrollable-without-scrollbar" 
                style="height: 10rem;"
            >
                <div 
                    v-for="(time, index) in times" :key="`time-${index}`"
                    class="flex px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                    :class="['time-slot', { 'time-slot-disabled': !isActiveTime(time), 'time-slot-active': isActiveTime(time) }]"
                    @click="selectTime(time)"
                >
                    {{ time }}
                </div>
            </div>
            <div 
                class="bg-white rounded-md shadow-lg z-10 ml-2" 
                style="height: fit-content;"
            >
                <div 
                    v-for="(period, index) in periods" :key="`period-${index}`"
                    class="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm text-gray-700" 
                    @click="selectPeriod(period)"
                >
                    {{ period }}
                </div>
            </div>
        </div>

        <p>Selected Time: {{ selectedTime }} {{ selectedPeriod }}</p>
    </div>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps({
    use12HourFormat:{
        type:Boolean,
        required:true
    },
    firstRangeTime:{
        type:Object,
        required:true
    },
    secondRangeTime:{
        type:Object,
    },
    slotGap:{
        type:Number,
        default:30
    },
    timeZone:{
        type:String,
        default:"Asia/Kolkata"
    }
})

const showDropdown = ref(false);
const times = ref<string[]>([]);
const selectedTime = ref('');
const currentTime = ref('');

const selectedPeriod = ref('PM');
const periods = ['AM', 'PM'];

const activeTimeRanges = [
    props.firstRangeTime,
    props.secondRangeTime,
];

const populateTimeOptions = (startHour: number, startMinute: number, use12HourFormat: boolean) => {
  const _times: string[] = [];
  let hour = startHour;
  let minute = startMinute;
  const hourLimit = use12HourFormat ? 12 : 24;
  let period = 'AM';

  // Determine initial period for 12-hour format
  if (use12HourFormat && hour >= 12) {
    period = 'PM';
    hour = hour > 12 ? hour - 12 : hour; // Convert 24h to 12h format if hour is 13-23
  }

  for (let i = 0; i < 48; i++) { 
    // 2 slots per hour, 24 hours
    let formattedHour = hour.toString();
    if (use12HourFormat) {
      // 12-hour format needs to cycle between 1-12, not 0-11
      formattedHour = hour === 0 ? '12' : hour.toString();
    }

    // Push time with AM/PM if using 12-hour format, otherwise just the time
    _times.push(use12HourFormat ? `${formattedHour.padStart(2, '0')}:${minute.toString().padStart(2, '0')}` : `${formattedHour.padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);

    // Increment minute and adjust hour and period accordingly
    minute += props.slotGap;
    if (minute >= 60) {
      minute -= 60; // Reset minutes after reaching 60
      hour = (hour % hourLimit) + 1; // Increment hour and loop back after reaching hourLimit

      // Toggle period between AM and PM for 12-hour format
      if (use12HourFormat && hour === 12) {
        period = period === 'AM' ? 'PM' : 'AM';
      }
    }
  }
  times.value = _times;
};

const formatTime = (hour: number, minute: number) => {
    const formattedHour = hour < 10 ? `0${hour}` : hour.toString();
    const formattedMinute = minute < 10 ? `0${minute}` : minute.toString();
    return `${formattedHour}:${formattedMinute}`;
};

const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
    if (showDropdown.value) {
        const now = getCurrentTimeIST();
        populateTimeOptions(now.getHours(), now.getMinutes() - (now.getMinutes() % 30), props.use12HourFormat);
        currentTime.value = times.value[0]; 
        selectedPeriod.value = now.getHours() >= 12 ? 'PM' : 'AM';
    }
};

const getCurrentTimeIST = () => {   
    return new Date(new Date().toLocaleString("en-US", { timeZone: props.timeZone }));
}

const addDays = (dateStr: string, days: number): string => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

const isActiveTime = (time: string): boolean => {
    const now = getCurrentTimeIST(); 
    let getMinitute;
    if(props.use12HourFormat){
        getMinitute = new Date(now).toLocaleString("en-US", { hour: 'numeric', hour12: props.use12HourFormat}).replace("PM", "");
    } else {
        getMinitute = new Date(now).toLocaleString("en-US", { hour: 'numeric', hour12: props.use12HourFormat});
    }
    
    const currentDateStr = now.toISOString().split('T')[0]; // 'YYYY-MM-DD' format
    const currentTime = getMinitute * 60 + now.getMinutes(); // current time in minutes   
    
    return activeTimeRanges.some((range) => {
        const [startHour, startMinutes] = range?.start.split(':').map(Number);
        const [endHour, endMinutes] = range?.end.split(':').map(Number);
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

const selectTime = (time: string) => {
    if (isActiveTime(time)) {
        selectedTime.value = time;
        showDropdown.value = false;
    }
};

const selectPeriod = (period: string) => {
    selectedPeriod.value = period;
};

onMounted(() => {
    const now = getCurrentTimeIST();
    selectedTime.value = formatTime(now.getHours(), now.getMinutes() - (now.getMinutes() % props.slotGap));
});
</script>

<style>
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
.scrollable-without-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
    overflow-y: scroll;
}

.scrollable-without-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
  
  