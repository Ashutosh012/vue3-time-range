# vue3-time-range

> Vue3 Time Range is fully customizable component that will help you to use time based on ranges. It will super helpful in appointment apps. for e.g doctor have 2 ranges of time in a day. One is 10 AM to 1 PM and second is 04 PM to 06 PM and for that you can't enable whole day time in time picker otherwise user will pick any time for the appointment. This plugin is gonna fix that issue and helpful to book an appointment through any website easily. It is built with Vue 3.x, composition API and typescript.

## ⚙️ Installation

To install the latest stable version:

```sh
npm i vue3-time-range
```

## 📖 Usage

### 1/3. Register as a Vue component globally
```js
//  main.js or main.ts
import { createApp } from 'vue'
import App from './App.vue'

import TimeRange from "vue3-time-range"
import "vue3-time-range/dist/style.css"

const app = createApp(App)

app.use(TimeRange);

app.mount('#app')
```

### 2/3. Use the registered component in your Vue template

```html
<template>
  <div>
    <TimeRange
    v-model="timeValue"
    :use12HourFormat="false"
    :firstRangeTime="{start:'10:00', end:'01:00'}"
    :secondRangeTime="{start:'16:00', end:'18:00'}"
    :slotGap="30"
    :timeZone="'Asia/Kolkata'"
    ></TimeRange>
  </div>
</template>
```

## 🍔 Props

<table>
  <tr>
    <th>Name<br></th>
    <th>Type</th>
    <th>Required</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>modelValue</td>
    <td>String</td>
    <td>true</td>
    <td>""</td>
    <td>v-model:value for bind dynamic value</td>
  </tr>
  <tr>
    <td>use12HourFormat</td>
    <td>Boolean</td>
    <td>true</td>
    <td>""</td>
    <td>If you want to use 12 hour format 0 to 11 then pass it as true or if you need 24 hour format (0 to 23) then pass it as false</td>
  </tr>
  <tr>
    <td>firstRangeTime</td>
    <td>Object</td>
    <td>true</td>
    <td>""</td>
    <td>you have to pass time range in object format like this way {start:'10:00', end:'01:00'} or {start:'10:00', end:'13:00'}</td>
  </tr>
  <tr>
    <td>secondRangeTime</td>
    <td>Object</td>
    <td>false</td>
    <td>{}</td>
    <td>you have to pass time range in object format like this way {start:'04:00', end:'06:00'} or {start:'16:00', end:'18:00'}</td>
  </tr>
  <tr>
    <td>slotGap</td>
    <td>Number</td>
    <td>false</td>
    <td>30</td>
    <td>you can select the gap between slots, for e.g in 4 to 6 you will get 4 slots of half hours. so active hours will be 4, 4:30, 5, 5:30</td>
  </tr>
  <tr>
    <td>Timezone</td>
    <td>String</td>
    <td>false</td>
    <td>Asia/Kolkata</td>
    <td>you can pass whatever timezone you want to add in this prop</td>
  </tr>
</table>

## ☕ Buy me a coffee
If you like this component and like my work then please make some contribution in below link.
https://www.buymeacoffee.com/ashuab

## 🤟🏽 License

[MIT](https://choosealicense.com/licenses/mit/)

## 📓 Contributing

Contributions are always welcome!

Please adhere to this project's `code of conduct`.

## 🧸 Appendix

Feel free to use (https://github.com/Ashutosh012/vue3-time-range.git) it in your project, report bugs and make PR 👏🏽.