import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import vuetify from 'vite-plugin-vuetify'
import Unocss from 'unocss/vite'

export default defineConfig({
  plugins: [
    vue(),
    Unocss(),
    vuetify({ autoImport: true }),
  ],
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
  optimizeDeps: {
    include: [
      'element-plus',
      'vxe-table',
      'ant-design-vue',
      'naive-ui',
      'vuetify',
      '@arco-design/web-vue',
      'primevue',
    ],
  },
})
