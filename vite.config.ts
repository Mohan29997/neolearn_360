import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://10.0.28.198:3001',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: [
        'src/utils/**',
        'src/shared/**',
        'src/helper/**',
        'src/storagemanager/**',
        'src/store/reducer/**',
        'src/hooks/**',
        'src/service/**',
        'src/constants/**',
      ],
      exclude: [
        'src/service/service.d.ts',
        'src/tests/**',
      ],
      thresholds: {
        lines: 90,
        branches: 90,
        functions: 90,
        statements: 90,
      },
    },
  },
})
