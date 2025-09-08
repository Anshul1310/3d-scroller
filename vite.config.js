import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          lenis: ['@studio-freight/lenis']
        }
      }
    }
  },
  publicDir: 'public',
  server: {
    host: true
  }
})
