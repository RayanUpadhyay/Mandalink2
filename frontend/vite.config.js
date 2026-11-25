import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // a fresh id per build: the service worker is registered as /sw.js?v=<id>, so each deploy replaces the old cache
  define: {
    __BUILD_ID__: JSON.stringify(Date.now().toString(36))
  },
  server: {
    port: 5173
  }
})
