import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/rcts/dsi-demo1/',
  plugins: [react()],
})
