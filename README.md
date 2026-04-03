# vue3-mobile-table

> Granting desktop tables a native-grade "soul" on mobile.

vue3-mobile-table is a lightweight, high-performance Vue 3 mobile table solution.

[![npm version](https://img.shields.io/npm/v/vue3-mobile-table.svg)](https://www.npmjs.com/package/vue3-mobile-table)
[![npm downloads](https://img.shields.io/npm/dm/vue3-mobile-table.svg)](https://www.npmjs.com/package/vue3-mobile-table)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/vue3-mobile-table)](https://bundlephobia.com/package/vue3-mobile-table)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/github/actions/workflow/status/LostElkByte/vue3-mobile-table/ci.yml?branch=main)](https://github.com/LostElkByte/vue3-mobile-table/actions)
[![Coverage](https://img.shields.io/codecov/c/github/LostElkByte/vue3-mobile-table)](https://codecov.io/gh/LostElkByte/vue3-mobile-table)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Socket Badge](https://badge.socket.dev/npm/package/vue3-mobile-table)](https://badge.socket.dev/npm/package/vue3-mobile-table)

## 💡 Why do we need it? (The Pain Points)

Developing complex business tables for mobile is often an "interaction nightmare":

- 🧩 **Ecosystem Gap**: Within the Vue 3 ecosystem, there is still a lack of mature mobile table components that can truly match the complex business requirements handled by desktop powerhouses (like Element Plus or AntD).
- 😫 **Adaptation Hurdles**: Simply reusing desktop components leads to a poor experience—clunky scrolling, header desynchronization, and frustrating diagonal swipe conflicts.
- 🛠 **Development Overhead**: Building a high-performance, touch-friendly table from scratch? The R&D and maintenance costs are staggering.

Stop reinventing the wheel!

## 🚀 Our Vision

This solution is specifically designed for "Adapting Desktop to Mobile."

No need to reinvent the wheel—with just one line of code, you can empower table components from any PC UI library (such as Element Plus, Ant Design Vue, or Naive UI) with a native-grade, silky-smooth mobile interaction experience.

## ✨ Core Features

- **Physics-Based Inertial Engine** — Utilizes Delta Time frame-rate normalization to eliminate speed variances across different refresh rates, ensuring a consistent, silky-smooth feel on any Hz screen. Built-in intelligent inertia protection identifies finger pauses to prevent accidental inertial triggers.
- **Gesture Intent & Axis Locking** — Millisecond-level intent determination filters diagonal jitter. Operations are locked to a single axis (horizontal or vertical) throughout the gesture, eliminating the "diagonal drift" pain point when browsing long tables.
- **Intelligent Edge Sensing** — Automatically detects scroll boundaries. When reaching the edge, control is smoothly handed back to the browser, maintaining full compatibility with system-level native interactions like iOS slide-to-back.
- **Dynamic Braking & Click Protection** — Smartly distinguishes between "braking" and "triggering." Click events are intercepted only during high-speed inertia to provide immediate stabilization, preventing accidental clicks while flicking through data.
- **Multi-Touch Tracking & Gesture Adaptation** — Locks onto active fingers using Touch ID to eliminate coordinate jumps during finger handover. When multi-touch gestures (e.g., pinch-to-zoom) are detected, the engine enters a silent mode, allowing the browser to handle native behaviors.
- **Deep UI Library Integration** — Built-in presets for over ten major UI libraries, including Element Plus, Ant Design Vue, Naive UI, and VxeTable. Achieve deep interaction optimization with just a single line of code.
- **Multi-Mode Device Adaptation (Lazy Hijacking)** — An optimized state machine for hybrid devices like Surface and touch-screen laptops. Offers zero-intrusion for pure mouse operations, activating on-demand only for touch inputs to ensure seamless transitions between input methods.
- **Landscape Mode Gesture Calibration** — Fully supports CSS `transform: rotate()` scenarios. Automatically corrects touch trajectories via intelligent axis mapping, ensuring touch directions align perfectly with visual intuition without additional computational overhead.
- **Lightweight & Zero Dependencies** — Implemented in pure TypeScript with no third-party package dependencies, ensuring a clean and stable core logic.

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
import Vue3MobileTable from 'vue3-mobile-table'
import App from './App.vue'

const app = createApp(App)
app.use(Vue3MobileTable)
app.mount('#app')
```

### Local Registration

```vue
<script setup lang="ts">
import { vMobileTable } from 'vue3-mobile-table'
</script>

<template>
  <div v-mobile-table class="table-container">
    <el-table :data="tableData" height="400">
      <!-- your table content -->
    </el-table>
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
import { type MobileTableOptions, vMobileTable } from 'vue3-mobile-table'

const options: MobileTableOptions = {
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
| `enabled` | `boolean` | `true` | Whether to enable the directive. When `false`, all event listeners and style hijacking are fully cleaned up (equivalent to passing `false` to the directive) |
| `preset` | `TablePreset` | - | UI library preset name, automatically applies the corresponding scroll container selector |
| `selector` | `string` | - | CSS selector for the target scroll element, takes priority over `preset` |
| `friction` | `number` | `0.95` | Friction/decay rate. Higher = slower decay (smoother scrolling), lower = faster stop (range: 0.8 - 0.99) |
| `dragThreshold` | `number` | `5` | Displacement threshold (px) before determining scroll direction, distinguishes minor jitter from intentional dragging |
| `disableInertia` | `boolean` | `false` | Whether to disable inertia scrolling. When `true`, scrolling stops immediately on finger release |
| `clickBlockThreshold` | `number` | `0.5` | Speed threshold (px/ms) for emergency stop click blocking. Higher = more lenient, lower = more strict (range: 0.3 - 1.0) |
| `mode` | `'auto' \| 'always'` | `'auto'` | Device detection mode. `'auto'`: automatic detection with lazy hijacking for hybrid devices. `'always'`: always activate touch handling regardless of device type |
| `rotation` | `0 \| 90 \| -90 \| 180` | `0` | CSS rotation angle (degrees). When the container uses CSS `transform: rotate()` to simulate landscape mode, the directive applies an inverse transform to touch coordinates for correct scroll mapping |
| `disableEdgeDetection` | `boolean` | `false` | Whether to disable edge detection. When `true`, the directive will not hand control back to the browser when scrolling reaches the boundary. Useful for fullscreen overlays where native gestures (e.g. iOS swipe-back) are unwanted |
| `onScrollStart` | `() => void` | - | Callback fired when scrolling starts, after finger displacement exceeds `dragThreshold` and direction is locked |
| `onScrollEnd` | `() => void` | - | Callback fired when scrolling ends, after inertia animation fully stops |

Scroll container priority: `selector` > `preset` > the directive's bound element.

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
import Vue3MobileTable from 'vue3-mobile-table'
// Named exports
import {
  vMobileTable,           // Directive
  type MobileTableOptions, // Options type
  type TablePreset,             // Preset type
  type DeviceType,              // Device type: 'mobile' | 'desktop' | 'hybrid'
  type HijackState,             // Lazy hijacking state: 'dormant' | 'standby' | 'pending-active' | 'active'
  UI_LIBRARY_SELECTORS,         // UI library selector mapping
  getSelectorByPreset,          // Get selector by preset
  detectDeviceType,             // Detect current device type
} from 'vue3-mobile-table'
```

## 🧑‍💻 For contributors

The following is for **people working in this Git repository** (fixing bugs, adding presets, updating docs, or cutting releases). If you only consume **`vue3-mobile-table` from npm**, you do not need any of this.

1. Use **pnpm** (version pinned in the root [`package.json`](package.json) `packageManager` field).
2. **Fork and clone**, then `pnpm install` at the repo root.
3. For branch workflow, testing expectations, and review etiquette, read the **[Contributing Guide](CONTRIBUTING.md)**.

### Commands you will use most

| Command | What it does |
| --- | --- |
| `pnpm install` | Install all workspace dependencies |
| `pnpm dev` | Start the [`play/`](play/) Vite app to manually test the directive against real table UIs |
| `pnpm build` | Run the build pipeline ([`internal/build`](internal/build)) and emit publishable artifacts under `dist/vue3-mobile-table` |
| `pnpm test` | Run unit tests ([Vitest](https://vitest.dev/)) |
| `pnpm typecheck` | Type-check Node / web / Vitest projects |
| `pnpm lint` / `pnpm format` | ESLint (CI is zero-warning) and Prettier |
| `pnpm docs:dev` | Local docs site ([`docs/`](docs/), Nuxt) — optional when editing documentation |

### Repository layout

```
vue3-mobile-table/
├── packages/vue3-mobile-table/  # Library published to npm
│   ├── index.ts                   # Entry: plugin installer + public exports
│   └── src/
│       ├── directive.ts           # Touch handling & inertial scroll engine
│       ├── types.ts               # `MobileTableOptions` and related types
│       └── presets.ts             # UI library → scroll container selectors
├── internal/                      # Not published: build tooling, shared constants, ESLint preset
├── play/                          # Playground for integration-style manual testing
├── docs/                          # Documentation site (Nuxt + shadcn-docs-nuxt)
├── scripts/                       # Maintenance scripts (e.g. version bumps)
└── dist/                          # Build output (produced by `pnpm build`; typically gitignored)
```

## 🤝 Contributing

Issues and pull requests are welcome. Use **[CONTRIBUTING.md](CONTRIBUTING.md)** for setup, conventions, and the full checklist before opening a PR.

## 📄 License

[MIT](LICENSE) License © 2025-Present LostElk

## 📞 Support

If you have any questions or issues, please open an [issue](https://github.com/LostElkByte/vue3-mobile-table/issues) on GitHub.
