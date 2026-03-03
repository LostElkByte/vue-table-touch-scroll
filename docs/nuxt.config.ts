// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ['shadcn-docs-nuxt'],

  plugins: ['~/plugins/examples'],

  experimental: {
    payloadExtraction: false,
  },

  components: [{ path: '~/components' }],

  i18n: {
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        name: 'English',
        language: 'en-US',
      },
    ],
  },

  build: {
    transpile: ['@vue-table-touch-scroll/core'],
  },

  compatibilityDate: '2024-09-19',

  sourcemap: false,

  routeRules: {
    '/**': { prerender: true },
  },

  vite: {
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 1500,
    },
    optimizeDeps: {
      include: ['@vue-table-touch-scroll/core', 'element-plus', 'highlight.js'],
      esbuildOptions: {
        target: 'esnext',
      },
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      autoSubfolderIndex: false,
      failOnError: false,
    },
  },
})
