import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// /api est proxifié vers l'API (Prism par défaut, `API_URL=http://localhost:8080` pour l'API Go).
const apiUrl = process.env.API_URL ?? 'http://localhost:4010'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: apiUrl, changeOrigin: true, rewrite: (p) => p.replace(/^\/api/, '') },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/{unit,integration}/**/*.test.{ts,tsx}'],
  },
})
