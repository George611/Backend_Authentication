import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['backendauthentication-production.up.railway.app'],
    host: true, // Listen on all network interfaces
    port: 8080  // Ensure it matches Railway's port
  }
})
