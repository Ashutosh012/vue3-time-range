import { createApp } from 'vue'
import TimeRange from "./components/TimeRangeV002.vue";

createApp(TimeRange).mount('#app')

export default {
    install: (app:any) => {
        app.component("TimeRange", TimeRange)
    }
}