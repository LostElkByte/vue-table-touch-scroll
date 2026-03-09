export default defineAppConfig({
  shadcnDocs: {
    site: {
      name: 'Vue Table Touch Scroll',
      description:
        'A lightweight Vue 3 directive that provides silky-smooth touch scrolling for mobile tables.',
      ogImage: '/lostElk.png',
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
        enable: true,
        triggerType: 'icon',
        dropdownType: 'select',
      },
      logo: {
        light: '/logo.svg',
        dark: '/logo-dark.svg',
      },
      nav: [
        // {
        //   title: 'nav.docs',
        //   links: [
        //     {
        //       title: 'nav.getting_started',
        //       to: '/guide/introduction',
        //       description: 'nav.getting_started_desc',
        //       target: '_self',
        //     },
        //     {
        //       title: 'nav.components',
        //       to: '/components',
        //       description: 'nav.components_desc',
        //       target: '_self',
        //     },
        //   ],
        // },
        // {
        //   title: 'nav.links',
        //   links: [
        //     {
        //       title: 'Nuxt',
        //       to: 'https://nuxt.com',
        //       description: 'The Intuitive Vue Framework',
        //       target: '_blank',
        //     },
        //     {
        //       title: 'Shadcn Vue',
        //       to: 'https://shadcn-vue.com',
        //       description:
        //         'Re-usable components built with Reka UI and Tailwind CSS',
        //       target: '_blank',
        //     },
        //   ],
        // },
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
      levelStyle: 'aside',
      collapse: true,
      collapseLevel: 1,
      folderStyle: 'default',
    },
    main: {
      padded: true,
      breadCrumb: true,
      showTitle: true,
      codeCopyToast: false,
      codeCopyIcon: 'lucide:clipboard',
      editLink: {
        enable: false,
        pattern: '',
        text: 'Edit this page',
        icon: 'lucide:square-pen',
        placement: ['docsFooter'],
      },
      backToTop: true,
    },
    footer: {
      credits: 'Copyright © 2026',
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
      enableInMobile: true,
      enableInHomepage: false,
      progressBar: true,
      title: 'On this page',
      links: [],
    },
    search: {
      enable: true,
      inAside: false,
    },
  },
})
