import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Vue Table Touch Scroll',
  description: 'A Vue 3 directive for touch scrolling in tables',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: 'Examples', link: '/examples/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Directive', link: '/api/' },
            { text: 'Options', link: '/api/options' },
          ],
        },
      ],
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/yourusername/vue-table-touch-scroll',
      },
    ],
  },
})
