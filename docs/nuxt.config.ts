// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ["shadcn-docs-nuxt"],
  modules: ["@nuxtjs/i18n"],

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith("media-"),
    },
  },

  plugins: ["~/plugins/demo-components"],

  experimental: {
    payloadExtraction: false,
  },

  css: [],

  mdc: {
    highlight: {
      shikiEngine: "javascript",
      theme: {
        default: "github-light",
        dark: "github-dark",
      },
    },
  },

  components: [{ path: "~/components" }],

  i18n: {
    strategy: "prefix_except_default",
    defaultLocale: "en",
    locales: [
      {
        code: "en",
        name: "English",
        language: "en-US",
        file: "en.json",
      },
      {
        code: "zh",
        name: "中文",
        language: "zh-CN",
        file: "zh.json",
      },
    ],
    langDir: "locales/",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },

  icon: {
    customCollections: [
      {
        prefix: "custom-icon",
        dir: "./assets/icons",
      },
    ],
  },

  ogImage: {
    fonts: ["Geist:400", "Geist:700"],
  },

  compatibilityDate: "2024-09-19",

  sourcemap: false,

  routeRules: {
    "/**": { prerender: true },
  },

  vite: {
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 1500,
    },
    optimizeDeps: {
      include: ["dayjs", "@braintree/sanitize-url", "mermaid"],
      exclude: ["shadcn-vue"],
      esbuildOptions: {
        target: "esnext",
      },
    },
    resolve: {
      dedupe: ["dayjs"],
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      autoSubfolderIndex: false,
      failOnError: true,
    },
    storage: {
      cache: { driver: "memory" },
    },
  },

  // Exclude shadcn-vue from optimization to avoid shebang issues
  build: {
    transpile: ["shadcn-vue"],
  },
})
