import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', // Output folder
    emptyOutDir: true,
  },
  server: {
    // During development, proxy requests to the backend
    proxy: {
      '/info': 'http://localhost:3000',
      '/download': 'http://localhost:3000'
    }
  }
});