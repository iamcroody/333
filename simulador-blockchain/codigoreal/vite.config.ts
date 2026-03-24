import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Escuchar en 0.0.0.0
    port: 5173,
    strictPort: true, // Fallar si el puerto está ocupado en lugar de cambiarlo
  }
})