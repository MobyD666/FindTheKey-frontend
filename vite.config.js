import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/ftk/', // Set the base URL for the app
  plugins: [vue()],
})
