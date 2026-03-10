// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ['shadcn-docs-nuxt'],
  modules: ['@nuxtjs/i18n', '@element-plus/nuxt'],

  app: {
    baseURL:
      process.env.NODE_ENV === 'production' ? '/vue-table-touch-scroll/' : '/',
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('media-'),
    },
  },

  plugins: ['~/plugins/demo-components'],

  experimental: {
    payloadExtraction: false,
  },

  css: ['element-plus/theme-chalk/dark/css-vars.css'],

  mdc: {
    highlight: {
      shikiEngine: 'javascript',
      theme: {
        default: 'github-light',
        dark: 'github-dark',
      },
    },
  },

  components: [{ path: '~/components' }],

  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        name: 'English',
        language: 'en-US',
        file: 'en.json',
      },
      {
        code: 'zh',
        name: '中文',
        language: 'zh-CN',
        file: 'zh.json',
      },
    ],
    langDir: 'locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },

  icon: {
    customCollections: [
      {
        prefix: 'custom-icon',
        dir: './assets/icons',
      },
    ],
  },

  ogImage: {
    fonts: ['Geist:400', 'Geist:700'],
  },

  compatibilityDate: '2024-09-19',

  sourcemap: false,

  routeRules: {
    '/**': { prerender: true, isr: false },
    '/api/**': { cors: true },
  },

  vite: {
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 1500,
    },
    optimizeDeps: {
      include: [
        'dayjs',
        '@braintree/sanitize-url',
        'mermaid',
        'naive-ui',
        'vueuc',
      ],
      exclude: ['shadcn-vue'],
      esbuildOptions: {
        target: 'esnext',
      },
    },
    resolve: {
      dedupe: ['dayjs'],
    },
  },

  ssr: true,

  nitro: {
    prerender: {
      crawlLinks: true,
      autoSubfolderIndex: true,
      failOnError: false,
    },
    storage: {
      cache: { driver: 'memory' },
    },
  },

  // Exclude shadcn-vue from optimization to avoid shebang issues
  build: {
    transpile: ['shadcn-vue', 'naive-ui', 'vueuc', '@css-render/vue3-ssr'],
  },
})
