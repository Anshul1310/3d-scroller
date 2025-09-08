import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // Use relative paths for assets
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          lenis: ['@studio-freight/lenis']
        }
      }
    }
  },
  publicDir: 'public'
})
