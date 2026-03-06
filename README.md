# Vue Table Touch Scroll

A Vue 3 directive for adding touch and mouse drag scrolling to tables and scrollable elements.

[![npm version](https://img.shields.io/npm/v/vue-table-touch-scroll.svg)](https://www.npmjs.com/package/vue-table-touch-scroll)
[![CI](https://github.com/yourusername/vue-table-touch-scroll/workflows/CI/badge.svg)](https://github.com/yourusername/vue-table-touch-scroll/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/yourusername/vue-table-touch-scroll/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/vue-table-touch-scroll)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🚀 **Easy to Use** - Simple directive-based API
- ⚡️ **Lightweight** - Minimal bundle size with zero dependencies
- 📱 **Touch & Mouse Support** - Works on both mobile and desktop
- 🎨 **Customizable** - Configure scroll speed, cursor, and callbacks
- 🔧 **TypeScript** - Full TypeScript support with type definitions
- 📦 **Tree-shakable** - Modular architecture for optimal bundle size

## 📦 Installation

```bash
# npm
npm install vue-table-touch-scroll

# pnpm
pnpm add vue-table-touch-scroll

# yarn
yarn add vue-table-touch-scroll
```

## 🚀 Quick Start

### Global Registration

```ts
import { createApp } from 'vue'
import VueTableTouchScroll from 'vue-table-touch-scroll'
import App from './App.vue'

const app = createApp(App)
app.use(VueTableTouchScroll)
app.mount('#app')
```

### Local Registration

```vue
<script setup>
import { vTableTouchScroll } from 'vue-table-touch-scroll'
</script>

<template>
  <div v-table-touch-scroll class="table-container">
    <table>
      <!-- your table content -->
    </table>
  </div>
</template>

<style>
.table-container {
  max-width: 800px;
  overflow: auto;
}
</style>
```

## 📖 Usage

### Basic Example

```vue
<template>
  <div v-table-touch-scroll class="scrollable">
    <table>
      <thead>
        <tr>
          <th v-for="i in 20" :key="i">Column {{ i }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in 50" :key="row">
          <td v-for="col in 20" :key="col">
            Row {{ row }} - Col {{ col }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```

### With Options

```vue
<template>
  <div 
    v-table-touch-scroll="{
      scrollSpeed: 1.5,
      dragThreshold: 5,
      friction: 0.95,
      cursor: 'grab',
      onScrollStart: () => console.log('Started'),
      onScrollEnd: () => console.log('Ended')
    }"
    class="scrollable"
  >
    <table>
      <!-- content -->
    </table>
  </div>
</template>
```

## ⚙️ Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable/disable the directive |
| `scrollSpeed` | `number` | `1` | Scroll speed multiplier |
| `dragThreshold` | `number` | `5` | Minimum pixels to move before scrolling starts |
| `friction` | `number` | `0.95` | Friction/decay rate for inertia scrolling (0.8-0.99) |
| `cursor` | `'grab' \| 'move' \| 'default'` | `'grab'` | Cursor style when hovering |
| `onScrollStart` | `() => void` | `undefined` | Callback when scrolling starts |
| `onScrollEnd` | `() => void` | `undefined` | Callback when scrolling ends |

## 🏗️ Development

This project uses a monorepo structure with pnpm workspaces.

```bash
# Install dependencies
pnpm install

# Run playground for development
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Type checking
pnpm typecheck

# Lint and format
pnpm lint
pnpm format
```

## 📁 Project Structure

```
vue-table-touch-scroll/
├── packages/
│   ├── core/              # Core directive implementation
│   ├── utils/             # Utility functions
│   └── vue-table-touch-scroll/  # Main package entry
├── internal/
│   └── build/             # Build toolchain
├── play/                  # Development playground
├── docs/                  # VitePress documentation
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

[MIT](LICENSE) License © 2024

## 🙏 Acknowledgments

Inspired by [Element Plus](https://github.com/element-plus/element-plus) architecture.
