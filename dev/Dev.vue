<template>
    <TimeRange
    :use12HourFormat="false"
    :firstRangeTime="{start:'10:00', end:'01:00'}"
    :secondRangeTime="{start:'16:00', end:'18:00'}"
    :slotGap="30"
    :timeZone="'Asia/Kolkata'"
    ></TimeRange>
</template>

<script setup lang="ts">
import TimeRange from "../src/components/TimeRangeV002.vue"
</script>