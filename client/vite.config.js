import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://6z8nc489-8000.euw.devtunnels.ms',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
})
