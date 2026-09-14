import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // <-- Active 'test', 'expect', 'describe' partout automatiquement
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
});