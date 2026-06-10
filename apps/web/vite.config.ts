import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      fs: resolve(__dirname, './src/fs-mock.js'),
      '@fidel-tools/lang-am': resolve(__dirname, '../../packages/lang-am/am.json')
    }
  },
  server: {
    port: 5173,
    host: true
  }
})
