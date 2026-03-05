# Documentation Template

A beautiful documentation template built with Nuxt and shadcn-docs-nuxt.

## Features

- 🚀 **Nuxt 3** - The Intuitive Vue Framework
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 📝 **MDC** - Markdown Components for rich content
- 🌙 **Dark Mode** - Built-in dark mode support
- 🔍 **Search** - Full-text search powered by Nuxt Content
- 📱 **Responsive** - Mobile-friendly design
- 👁️ **Demo Preview** - Interactive component previews with code viewing

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
.
├── components/          # Vue components
│   ├── examples/        # Demo example components
│   ├── ComponentLoader.vue
│   ├── ComponentViewer.vue
│   ├── CodeViewerTab.vue
│   └── DemoTabs.vue
├── content/             # Markdown documentation
│   ├── 1.guide/         # Guide section
│   └── 2.components/    # Components section
├── public/              # Static assets
├── app.config.ts        # App configuration
├── nuxt.config.ts       # Nuxt configuration
└── tailwind.config.js   # Tailwind configuration
```

## Writing Documentation

Documentation is written in Markdown with MDC (Markdown Components) support in the `content/` directory.

### Adding a New Page

1. Create a new `.md` file in the appropriate section folder
2. Add frontmatter with title and description
3. Write your content using Markdown and MDC components

Example:

```md
---
title: My Page
description: A description of my page.
icon: lucide:star
---

# My Page

Your content here...

::alert{type="info"}
This is an alert!
::
```

### Creating Demo Components

1. Create your component in `components/examples/`
2. Export it from `components/examples/index.ts`
3. Use `ComponentLoader` in your markdown:

```md
::ComponentLoader{componentName="MyComponent" label="My Component"}
::
```

## Configuration

Edit `app.config.ts` to customize:

- Site name and description
- Theme colors
- Navigation links
- Header and footer settings

## License

MIT
