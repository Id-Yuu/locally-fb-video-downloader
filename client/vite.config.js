import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/info': 'http://localhost:3000',
      '/download': 'http://localhost:3000'
    }
  }
})