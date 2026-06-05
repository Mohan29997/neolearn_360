import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'https://neo-learn-360.vercel.app',
        changeOrigin: true,
      },
    },
  },
})
