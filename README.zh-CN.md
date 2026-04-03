# Vue3 Mobile Table

vue3-mobile-table 是一款专为 Vue 桌面端表格组件适配移动端所打造的轻量级交互扩展引擎。完美兼容 Element Plus、Ant Design Vue 与 Vxe Table 等主流组件库，只需一行代码，即可为 PC 端表格赋予在移动端原生级的丝滑交互体验。

[![npm version](https://img.shields.io/npm/v/vue3-mobile-table.svg)](https://www.npmjs.com/package/vue3-mobile-table)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/github/actions/workflow/status/LostElkByte/vue3-mobile-table/ci.yml?branch=main)](https://github.com/LostElkByte/vue3-mobile-table/actions)
[![Coverage](https://img.shields.io/codecov/c/github/LostElkByte/vue3-mobile-table)](https://codecov.io/gh/LostElkByte/vue3-mobile-table)

## ✨ 特性

- 🚀 **简单易用** - 基于指令的简洁 API
- ⚡️ **轻量级** - 零依赖，极小的打包体积
- 📱 **触摸 & 鼠标支持** - 同时支持移动端和桌面端
- 🎯 **UI 库预设** - 内置主流 UI 库的滚动容器选择器
- 🔧 **TypeScript** - 完整的 TypeScript 类型支持
- 🎨 **物理滚动** - 真实的惯性滚动和摩擦力模拟
- 📦 **零配置** - 开箱即用，默认配置合理

## 📖 文档

更详细的文档，请访问 [vue3-mobile-table 文档](https://lostelkbyte.github.io/vue3-mobile-table/)。

## 📦 安装

```bash
# npm
npm install vue3-mobile-table

# pnpm
pnpm add vue3-mobile-table

# yarn
yarn add vue3-mobile-table
```

## 🚀 快速开始

### 全局注册

```ts
import { createApp } from 'vue'
import Vue3MobileTable from 'vue3-mobile-table'
import App from './App.vue'

const app = createApp(App)
app.use(Vue3MobileTable)
app.mount('#app')
```

### 局部注册

```vue
<script setup lang="ts">
import { vMobileTable } from 'vue3-mobile-table'
</script>

<template>
  <div v-mobile-table class="table-container">
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
  <div v-mobile-table="{ preset: 'element-plus' }">
    <el-table :data="tableData" height="400">
      <!-- 列配置 -->
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

### 自定义选择器

```vue
<template>
  <div v-mobile-table="{ selector: '.custom-scroll-container' }">
    <CustomTable />
  </div>
</template>
```

### 完整配置示例

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
  onScrollStart: () => console.log('滚动开始'),
  onScrollEnd: () => console.log('滚动结束'),
}

const enabled = ref(true)
</script>

<template>
  <div v-mobile-table="enabled ? options : false">
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
import Vue3MobileTable from 'vue3-mobile-table'
// 命名导出
import {
  vMobileTable,           // 指令
  type MobileTableOptions, // 选项类型
  type TablePreset,             // 预设类型
  UI_LIBRARY_SELECTORS,         // UI 库选择器映射
  getSelectorByPreset,          // 根据预设获取选择器
} from 'vue3-mobile-table'
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
vue3-mobile-table/
├── packages/
│   ├── core/                    # 核心指令实现
│   ├── utils/                   # 工具函数
│   └── vue3-mobile-table/  # 主包入口
├── play/                        # 开发测试环境
├── docs/                        # 文档站点
└── README.md
```

## 🤝 贡献

欢迎贡献！请阅读 [贡献指南](CONTRIBUTING.md) 了解详情。

## 📄 许可证

[MIT](LICENSE) License © 2024-至今 LostElk

## 🌟 为什么选择 Vue3 Mobile Table？

- **原生般体验**：在移动设备上提供流畅、原生级的滚动体验
- **零依赖**：无外部依赖，保持你的打包体积最小
- **通用兼容性**：适用于任何 Vue 3 项目和流行的 UI 库
- **性能优化**：构建时考虑性能，使用 requestAnimationFrame 和优化的事件处理
- **TypeScript 支持**：完整的 TypeScript 类型，提供更好的开发体验
- **可扩展**：易于自定义和扩展，支持添加自己的滚动容器选择器

## 📞 支持

如果你有任何问题或问题，请在 GitHub 上打开 [issue](https://github.com/LostElkByte/vue3-mobile-table/issues)。
