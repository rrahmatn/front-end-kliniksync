import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Mengizinkan koneksi eksternal
    port: 5173, // Sesuaikan dengan port yang Anda gunakan
  }
})
