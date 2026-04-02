# Vue3 Mobile Table

vue3-mobile-table is a lightweight solution dedicated to bridging the gap between desktop tables and mobile touch interactions. With a simple directive, it ensures that any Vue PC table component delivers a native-grade, silky-smooth scrolling and interaction experience on mobile devices. This includes seamless out-of-the-box support for table components in mainstream UI libraries like Element Plus, Ant Design Vue, and Naive UI.

[![npm version](https://img.shields.io/npm/v/vue3-mobile-table.svg)](https://www.npmjs.com/package/vue3-mobile-table)
[![npm downloads](https://img.shields.io/npm/dm/vue3-mobile-table.svg)](https://www.npmjs.com/package/vue3-mobile-table)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/vue3-mobile-table)](https://bundlephobia.com/package/vue3-mobile-table)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/github/actions/workflow/status/LostElkByte/vue3-mobile-table/ci.yml?branch=main)](https://github.com/LostElkByte/vue3-mobile-table/actions)
[![Coverage](https://img.shields.io/codecov/c/github/LostElkByte/vue3-mobile-table)](https://codecov.io/gh/LostElkByte/vue3-mobile-table)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Socket Badge](https://badge.socket.dev/npm/package/vue3-mobile-table/1.0.5)](https://badge.socket.dev/npm/package/vue3-mobile-table)

## ✨ Features

- 🚀 **Easy to Use** - Simple directive-based API
- ⚡️ **Lightweight** - Zero dependencies, minimal bundle size
- 🎯 **UI Library Presets** - Built-in presets for Element Plus, Ant Design Vue, Naive UI, VxeTable, Arco Design, PrimeVue, Vuetify
- 🎨 **Physics-based Scrolling** - Delta-Time normalized inertia and friction simulation, consistent across any screen refresh rate
- 🔒 **Axis Locking** - One-shot gesture direction lock eliminates diagonal jitter
- 🖐️ **Multi-touch Handling** - Active finger tracking prevents coordinate jumps; multi-finger silencing for native gestures (pinch-to-zoom)
- 📱 **Hybrid Device Support** - 4-state lazy hijacking state machine: zero interference on pure PC, on-demand activation for hybrid devices (Surface, touchscreen laptops)
- 🔄 **CSS Rotation Support** - Inverse coordinate transform for CSS `rotate()` landscape mode
- 🔧 **TypeScript** - Full TypeScript support with type definitions
- 📦 **Zero Configuration** - Works out of the box with sensible defaults

## 📖 Documentation

For more detailed documentation, please visit [vue3-mobile-table documentation](https://lostelkbyte.github.io/vue3-mobile-table/).

## 📦 Installation

```bash
# npm
npm install vue3-mobile-table

# pnpm
pnpm add vue3-mobile-table

# yarn
yarn add vue3-mobile-table
```

## 🚀 Quick Start

### Global Registration

```ts
import { createApp } from 'vue'
import VueTableTouchScroll from 'vue3-mobile-table'
import App from './App.vue'

const app = createApp(App)
app.use(VueTableTouchScroll)
app.mount('#app')
```

### Local Registration

```vue
<script setup lang="ts">
import { vTableTouchScroll } from 'vue3-mobile-table'
</script>

<template>
  <div v-mobile-table class="table-container">
    <table>
      <!-- your table content -->
    </table>
  </div>
</template>
```

## 📖 Usage

### With UI Library Presets

```vue
<template>
  <!-- Element Plus -->
  <div v-mobile-table="{ preset: 'element-plus' }">
    <el-table :data="tableData" height="400">
      <!-- column config -->
    </el-table>
  </div>

  <!-- Ant Design Vue -->
  <div v-mobile-table="{ preset: 'ant-design-vue' }">
    <a-table :data-source="tableData" :scroll="{ x: 1300, y: 400 }" />
  </div>

  <!-- Naive UI -->
  <div v-mobile-table="{ preset: 'naive-ui' }">
    <n-data-table :columns="columns" :data="tableData" :scroll-x="1300" />
  </div>
</template>
```

### Custom Selector

```vue
<template>
  <div v-mobile-table="{ selector: '.custom-scroll-container' }">
    <CustomTable />
  </div>
</template>
```

### Full Configuration Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { type TableTouchScrollOptions, vTableTouchScroll } from 'vue3-mobile-table'

const options: TableTouchScrollOptions = {
  preset: 'element-plus',
  dragThreshold: 5,
  friction: 0.95,
  disableInertia: false,
  clickBlockThreshold: 0.5,
  onScrollStart: () => console.log('Scroll started'),
  onScrollEnd: () => console.log('Scroll ended'),
}

const enabled = ref(true)
</script>

<template>
  <div v-mobile-table="enabled ? options : false">
    <el-table :data="tableData" height="400">
      <!-- column config -->
    </el-table>
  </div>
</template>
```

## ⚙️ Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable/disable the directive |
| `preset` | `TablePreset` | - | UI library preset name |
| `selector` | `string` | - | CSS selector for the target scroll element |
| `dragThreshold` | `number` | `5` | Movement threshold (px) before scroll direction is determined |
| `friction` | `number` | `0.95` | Friction/decay rate for inertia scrolling (0.8-0.99) |
| `disableInertia` | `boolean` | `false` | Disable inertia scrolling |
| `clickBlockThreshold` | `number` | `0.5` | Velocity threshold (px/ms) for blocking clicks after fast scrolling |
| `mode` | `'auto' \| 'always'` | `'auto'` | Device detection mode. `'auto'`: lazy hijacking for hybrid devices; `'always'`: force enable |
| `rotation` | `0 \| 90 \| -90 \| 180` | `0` | CSS rotation angle for inverse-transforming touch coordinates in landscape mode |
| `disableEdgeDetection` | `boolean` | `false` | Disable edge detection; when `true`, never hands control back to browser at scroll boundaries |
| `onScrollStart` | `() => void` | - | Callback when scrolling starts |
| `onScrollEnd` | `() => void` | - | Callback when scrolling ends |

### UI Library Presets

| Preset | UI Library | Scroll Container Selector |
|--------|------------|---------------------------|
| `'element-plus'` | Element Plus | `.el-scrollbar__wrap` |
| `'ant-design-vue'` | Ant Design Vue | `.ant-table-body` |
| `'arco-design'` | Arco Design | `.arco-table-body` |
| `'naive-ui'` | Naive UI | `.n-scrollbar-container` |
| `'primevue'` | PrimeVue | `.p-datatable-table-container` |
| `'vuetify'` | Vuetify | `.v-table__wrapper tbody` |
| `'vxe-table'` | VxeTable | `.vxe-table--body-inner-wrapper` |

## 📦 Exports

```ts
// Default export: Vue plugin (for global registration)
import VueTableTouchScroll from 'vue3-mobile-table'
// Named exports
import {
  vTableTouchScroll,           // Directive
  type TableTouchScrollOptions, // Options type
  type TablePreset,             // Preset type
  type DeviceType,              // Device type: 'mobile' | 'desktop' | 'hybrid'
  type HijackState,             // Lazy hijacking state: 'dormant' | 'standby' | 'pending-active' | 'active'
  UI_LIBRARY_SELECTORS,         // UI library selector mapping
  getSelectorByPreset,          // Get selector by preset
  detectDeviceType,             // Detect current device type
} from 'vue3-mobile-table'
```

## 🏗️ Development

This project uses a pnpm workspaces monorepo structure.

```bash
# Install dependencies
pnpm install

# Run development environment
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
vue3-mobile-table/
├── packages/
│   └── vue3-mobile-table/  # Core directive package
│       └── src/
│           ├── directive.ts     # Scroll engine implementation
│           ├── types.ts         # TypeScript type definitions
│           ├── presets.ts       # UI library preset selectors
│           └── index.ts         # Package entry & exports
├── play/                        # Development playground (UI library examples)
├── docs/                        # Documentation site (Nuxt 3 + shadcn-docs-nuxt)
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

[MIT](LICENSE) License © 2024-Present LostElk

## 🌟 Why Choose Vue3 Mobile Table?

- **Native-like Experience**: Provides a smooth, native-grade scrolling experience on mobile devices
- **Zero Dependencies**: No external dependencies, keeping your bundle size minimal
- **Universal Compatibility**: Works with any Vue 3 project and popular UI libraries
- **Performance Optimized**: Built with performance in mind, using requestAnimationFrame and optimized event handling
- **TypeScript Support**: Full TypeScript types for better developer experience
- **Extensible**: Easy to customize and extend with your own scroll container selectors

## 📞 Support

If you have any questions or issues, please open an [issue](https://github.com/LostElkByte/vue3-mobile-table/issues) on GitHub.
