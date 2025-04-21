// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Update base to your desired subdirectory path
export default defineConfig({
  base: '/rcts/dsi-demo1',
  plugins: [react()],
});
