import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { backendPlugin } from './server/backendPlugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    backendPlugin()
  ],
})
