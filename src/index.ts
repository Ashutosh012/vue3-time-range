import TimeRange from "./components/TimeRange.vue";

export default {
    install: (app:any) => {
        app.component("TimeRange", TimeRange)
    }
}