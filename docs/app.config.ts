export default defineAppConfig({
  shadcnDocs: {
    site: {
      name: 'Vue Table Touch Scroll',
      description:
        'A lightweight Vue 3 directive for touch scrolling in tables. Seamless mobile experience for PC table components.',
    },
    theme: {
      customizable: true,
      color: 'zinc',
      radius: 0.5,
    },
    header: {
      title: 'Vue Table Touch Scroll',
      showTitle: true,
      darkModeToggle: true,
      languageSwitcher: {
        enable: false,
        triggerType: 'icon',
        dropdownType: 'select',
      },
      logo: {
        light: '/logo.svg',
        dark: '/logo-dark.svg',
      },
      nav: [
        {
          title: 'Docs',
          links: [
            {
              title: 'Getting Started',
              to: '/guide/introduction',
              description:
                'What is Vue Table Touch Scroll and why you should use it',
              target: '_self',
            },
            {
              title: 'API',
              to: '/api/parameters',
              description:
                'Explore the API parameters and configuration options',
              target: '_self',
            },
            {
              title: 'Examples',
              to: '/examples/element-plus',
              description: 'Real-world examples with popular UI libraries',
              target: '_self',
            },
          ],
        },
        {
          title: 'Community',
          links: [
            {
              title: 'GitHub',
              to: 'https://github.com/LostElkByte/vue-table-touch-scroll',
              description: 'View the source code on GitHub',
              target: '_blank',
            },
            {
              title: 'NPM',
              to: 'https://www.npmjs.com/package/vue-table-touch-scroll',
              description: 'View the package on NPM',
              target: '_blank',
            },
          ],
        },
      ],
      links: [
        {
          icon: 'lucide:github',
          to: 'https://github.com/LostElkByte/vue-table-touch-scroll',
          target: '_blank',
        },
      ],
    },
    aside: {
      useLevel: true,
      collapse: false,
    },
    main: {
      breadCrumb: true,
      showTitle: true,
    },
    footer: {
      credits: 'Copyright 2024 LostElk',
      links: [
        {
          icon: 'lucide:github',
          to: 'https://github.com/LostElkByte/vue-table-touch-scroll',
          target: '_blank',
        },
      ],
    },
    toc: {
      enable: true,
      links: [
        {
          title: 'Star on GitHub',
          icon: 'lucide:star',
          to: 'https://github.com/LostElkByte/vue-table-touch-scroll',
          target: '_blank',
        },
        {
          title: 'Create Issues',
          icon: 'lucide:circle-dot',
          to: 'https://github.com/LostElkByte/vue-table-touch-scroll/issues',
          target: '_blank',
        },
      ],
    },
    search: {
      enable: true,
      inAside: false,
    },
  },
})
