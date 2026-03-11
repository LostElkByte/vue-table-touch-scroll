import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import vuetify from 'vite-plugin-vuetify'
import Unocss from 'unocss/vite'

export default defineConfig({
  plugins: [vue(), Unocss(), vuetify({ autoImport: true })],
  resolve: {
    alias: {
      'vue-table-touch-scroll': path.resolve(
        __dirname,
        '../packages/vue-table-touch-scroll'
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
