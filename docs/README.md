# Vue3 Mobile Table - Documentation Site

vue3-mobile-table 的官方文档站，基于 Nuxt 3 和 shadcn-docs-nuxt 构建，支持中英文双语。

## Tech Stack

- **Nuxt 3** - The Intuitive Vue Framework
- **shadcn-docs-nuxt** - Documentation template with Tailwind CSS
- **Nuxt Content (MDC)** - Markdown Components for rich content
- **@nuxtjs/i18n** - Internationalization (English + Chinese)

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Project Structure

```
docs/
├── components/
│   ├── examples/              # Interactive demo components
│   │   ├── element-plus-example.vue
│   │   ├── ant-design-vue-example.vue
│   │   ├── naive-ui-example.vue
│   │   ├── vxe-table-example.vue
│   │   └── index.ts
│   ├── layout/                # Layout components
│   │   └── PrevNextButton.vue
│   ├── ui/                    # UI primitives (slider, switch)
│   ├── CodeViewerTab.vue
│   ├── ComponentLoader.vue
│   └── DemoTabs.vue
├── content/                   # English documentation (default locale)
│   ├── 1.guide/
│   │   ├── 1.introduction.md
│   │   ├── 2.configuration.md
│   │   ├── 3.landscape.md
│   │   └── 4.how-it-works.md
│   ├── 2.api/
│   │   └── 1.parameters.md
│   ├── 3.examples/
│   │   ├── 1.element-plus.md
│   │   ├── 2.ant-design-vue.md
│   │   ├── 3.naive-ui.md
│   │   ├── 4.vxe-table.md
│   │   └── 5.other-libraries.md
│   ├── zh/                    # Chinese documentation
│   │   ├── 1.guide/
│   │   ├── 2.api/
│   │   ├── 3.examples/
│   │   └── index.md
│   └── index.md
├── public/                    # Static assets
├── app.config.ts              # App configuration (site name, nav, theme)
├── nuxt.config.ts             # Nuxt configuration (modules, i18n)
└── package.json
```

## Writing Documentation

Documentation is written in Markdown with MDC (Markdown Components) support in the `content/` directory.

### Adding a New Page

1. Create a new `.md` file in the appropriate section folder
2. Add frontmatter with title, description, and icon
3. Write your content using Markdown and MDC components
4. For Chinese translations, mirror the file structure under `content/zh/`

Example:

```md
---
title: My Page
description: A description of my page.
icon: lucide:star
---

# My Page

Your content here...

::callout{icon="lucide:info" color="blue"}
This is a callout!
::
```

### Creating Interactive Demo Components

1. Create your component in `components/examples/`
2. Export it from `components/examples/index.ts`
3. Use `ComponentLoader` in your markdown:

```md
::ComponentLoader{componentName="MyComponent" label="My Component"}
::
```

## Configuration

- **app.config.ts** — Site name, description, theme colors, navigation links, header/footer settings
- **nuxt.config.ts** — Nuxt modules, i18n locales, content configuration

## License

MIT
