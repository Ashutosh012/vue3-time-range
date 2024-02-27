import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  build:{
    lib:{
      entry: resolve(__dirname, "src/index.ts"),
      name:"time-range",
      fileName: (format) => `time-slot.${format}.ts`
    },
    rollupOptions:{
      external: ["vue"],
      output:{
        globals:{
          vue: "Vue",
        }
      }
    }
  },
  plugins: [vue()],
  server:{
    port: 3000
  }
})
