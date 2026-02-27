import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@vue-table-touch-scroll/core': path.resolve(
        __dirname,
        '../packages/core'
      ),
      '@vue-table-touch-scroll/utils': path.resolve(
        __dirname,
        '../packages/utils'
      ),
    },
  },
  server: {
    port: 3000,
  },
})
