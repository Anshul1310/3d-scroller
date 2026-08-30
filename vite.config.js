import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        twoD: resolve(__dirname, '2d/index.html'),
        twoD0: resolve(__dirname, '2d0/index.html'),
        twoD1: resolve(__dirname, '2d1/index.html'),
        twoD2: resolve(__dirname, '2d2/index.html'),
        twoD3: resolve(__dirname, '2d3/index.html'),
        twoD4: resolve(__dirname, '2d4/index.html'),
        twoD5: resolve(__dirname, '2d5/index.html')
      }
    }
  },
  server: {
    port: 3000
  }
})