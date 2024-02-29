import TimeRange from "./components/TimeRangeV002.vue";

export default {
    install: (app:any) => {
        app.component("TimeRange", TimeRange)
    }
}