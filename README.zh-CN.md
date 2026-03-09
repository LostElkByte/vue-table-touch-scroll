# Vue Table Touch Scroll

一个为表格和可滚动元素添加触摸/鼠标拖拽滚动功能的 Vue 3 指令。

[![npm version](https://img.shields.io/npm/v/vue-table-touch-scroll.svg)](https://www.npmjs.com/package/vue-table-touch-scroll)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ 特性

- 🚀 **简单易用** - 基于指令的简洁 API
- ⚡️ **轻量级** - 零依赖，极小的打包体积
- 📱 **触摸 & 鼠标支持** - 同时支持移动端和桌面端
- 🎯 **UI 库预设** - 内置主流 UI 库的滚动容器选择器
- 🔧 **TypeScript** - 完整的 TypeScript 类型支持
- 🎨 **物理滚动** - 真实的惯性滚动和摩擦力模拟

## 📦 安装

```bash
# npm
npm install vue-table-touch-scroll

# pnpm
pnpm add vue-table-touch-scroll

# yarn
yarn add vue-table-touch-scroll
```

## 🚀 快速开始

### 全局注册

```ts
import { createApp } from 'vue'
import VueTableTouchScroll from 'vue-table-touch-scroll'
import App from './App.vue'

const app = createApp(App)
app.use(VueTableTouchScroll)
app.mount('#app')
```

### 局部注册

```vue
<script setup lang="ts">
import { vTableTouchScroll } from 'vue-table-touch-scroll'
</script>

<template>
  <div v-table-touch-scroll class="table-container">
    <table>
      <!-- 表格内容 -->
    </table>
  </div>
</template>
```

## 📖 使用示例

### 配合 UI 库使用

```vue
<template>
  <!-- Element Plus -->
  <div v-table-touch-scroll="{ preset: 'element-plus' }">
    <el-table :data="tableData" height="400">
      <!-- 列配置 -->
    </el-table>
  </div>

  <!-- Ant Design Vue -->
  <div v-table-touch-scroll="{ preset: 'ant-design-vue' }">
    <a-table :data-source="tableData" :scroll="{ x: 1300, y: 400 }" />
  </div>

  <!-- Naive UI -->
  <div v-table-touch-scroll="{ preset: 'naive-ui' }">
    <n-data-table :columns="columns" :data="tableData" :scroll-x="1300" />
  </div>
</template>
```

### 自定义选择器

```vue
<template>
  <div v-table-touch-scroll="{ selector: '.custom-scroll-container' }">
    <CustomTable />
  </div>
</template>
```

### 完整配置示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { type TableTouchScrollOptions, vTableTouchScroll } from 'vue-table-touch-scroll'

const options: TableTouchScrollOptions = {
  preset: 'element-plus',
  dragThreshold: 5,
  friction: 0.95,
  disableInertia: false,
  clickBlockThreshold: 0.5,
  onScrollStart: () => console.log('滚动开始'),
  onScrollEnd: () => console.log('滚动结束'),
}

const enabled = ref(true)
</script>

<template>
  <div v-table-touch-scroll="enabled ? options : false">
    <el-table :data="tableData" height="400">
      <!-- 列配置 -->
    </el-table>
  </div>
</template>
```

## ⚙️ 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | `boolean` | `true` | 是否启用滚动功能 |
| `preset` | `TablePreset` | - | UI 库预设名称 |
| `selector` | `string` | - | 目标滚动元素的 CSS 选择器 |
| `dragThreshold` | `number` | `5` | 判定滚动方向前的位移阈值 (px) |
| `friction` | `number` | `0.95` | 摩擦力/衰减率 (0.8-0.99) |
| `disableInertia` | `boolean` | `false` | 是否禁用惯性滚动 |
| `clickBlockThreshold` | `number` | `0.5` | 急停点击拦截的速度阈值 (px/ms) |
| `onScrollStart` | `() => void` | - | 滚动开始时的回调 |
| `onScrollEnd` | `() => void` | - | 滚动结束时的回调 |

### UI 库预设

| 预设值 | UI 库 | 滚动容器选择器 |
|--------|-------|----------------|
| `'element-plus'` | Element Plus | `.el-scrollbar__wrap` |
| `'ant-design-vue'` | Ant Design Vue | `.ant-table-body` |
| `'arco-design'` | Arco Design | `.arco-table-body` |
| `'naive-ui'` | Naive UI | `.n-scrollbar-container` |
| `'primevue'` | PrimeVue | `.p-datatable-table-container` |
| `'vuetify'` | Vuetify | `.v-table__wrapper tbody` |
| `'vxe-table'` | VxeTable | `.vxe-table--body-inner-wrapper` |

## 📦 导出

```ts
// 默认导出：Vue 插件（用于全局注册）
import VueTableTouchScroll from 'vue-table-touch-scroll'

// 命名导出
import {
  vTableTouchScroll,           // 指令
  type TableTouchScrollOptions, // 选项类型
  type TablePreset,             // 预设类型
  UI_LIBRARY_SELECTORS,         // UI 库选择器映射
  getSelectorByPreset,          // 根据预设获取选择器
} from 'vue-table-touch-scroll'
```

## 🏗️ 开发

本项目使用 pnpm workspaces 的 monorepo 结构。

```bash
# 安装依赖
pnpm install

# 运行开发环境
pnpm dev

# 构建所有包
pnpm build

# 运行测试
pnpm test

# 类型检查
pnpm typecheck

# 代码检查和格式化
pnpm lint
pnpm format
```

## 📁 项目结构

```
vue-table-touch-scroll/
├── packages/
│   ├── core/                    # 核心指令实现
│   ├── utils/                   # 工具函数
│   └── vue-table-touch-scroll/  # 主包入口
├── play/                        # 开发测试环境
├── docs/                        # 文档站点
└── README.md
```

## 🤝 贡献

欢迎贡献！请阅读 [贡献指南](CONTRIBUTING.md) 了解详情。

## 📄 许可证

[MIT](LICENSE) License © 2024
