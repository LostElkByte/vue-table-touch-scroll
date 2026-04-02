# Play - UI Library Examples

这是 `vue-table-touch-scroll` 的演示项目，展示了指令在各种主流 Vue UI 组件库中的使用。

## 🎯 支持的 UI 库

1. **Element Plus** - 企业级 UI 组件库
2. **VXE Table** - 强大的 Vue 表格组件（含虚拟滚动 BigData 示例）
3. **Ant Design Vue** - 企业级 UI 设计语言
4. **Naive UI** - Vue 3 组件库，完整的 TypeScript 支持
5. **Vuetify** - Material Design 组件框架
6. **Arco Design Vue** - 字节跳动出品的企业级设计系统
7. **PrimeVue** - 丰富的 Vue UI 组件库

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000 查看所有示例。

## 📁 项目结构

```
play/
├── src/
│   ├── examples/              # UI 库示例组件
│   │   ├── ElementPlusExample.vue
│   │   ├── VxeTableExample.vue
│   │   ├── AntdvExample.vue
│   │   ├── NaiveUIExample.vue
│   │   ├── VuetifyExample.vue
│   │   ├── ArcoExample.vue
│   │   └── PrimeVueExample.vue
│   ├── composables/           # 组合式函数
│   │   ├── useTableColumns.ts
│   │   └── useTableData.ts
│   ├── styles/                # 样式文件
│   │   ├── common.css
│   │   └── main.css
│   ├── App.vue               # 主应用（带导航与深色主题切换）
│   └── main.ts               # 入口文件
├── assets/                    # 静态资源
├── uno.config.ts              # UnoCSS 配置
├── vite.config.ts             # Vite 配置
├── tsconfig.json
└── package.json
```

## 💡 使用示例

### 基础用法

```vue
<template>
  <div v-table-touch-scroll>
    <el-table :data="tableData">
      <!-- 表格列 -->
    </el-table>
  </div>
</template>

<script setup>
import { vTableTouchScroll } from 'vue-table-touch-scroll'
</script>
```

### 使用预设

```vue
<template>
  <!-- Element Plus -->
  <div v-table-touch-scroll="{ preset: 'element-plus' }">
    <el-table :data="tableData" height="400" />
  </div>

  <!-- Naive UI -->
  <div v-table-touch-scroll="{ preset: 'naive-ui' }">
    <n-data-table :columns="columns" :data="tableData" />
  </div>

  <!-- VxeTable -->
  <div v-table-touch-scroll="{ preset: 'vxe-table' }">
    <vxe-table :data="tableData" height="400" />
  </div>
</template>
```

### 自定义配置

```vue
<template>
  <div v-table-touch-scroll="{
    preset: 'element-plus',
    dragThreshold: 10,
    friction: 0.92,
    mode: 'always',
    rotation: 0,
    onScrollStart: () => console.log('滚动开始'),
    onScrollEnd: () => console.log('滚动结束'),
  }">
    <el-table :data="tableData" />
  </div>
</template>
```

## 🎨 示例特性

每个 UI 库示例都包含：

- ✅ 基础表格 + 触摸滚动
- ✅ 固定列支持
- ✅ 分页功能
- ✅ 自定义配置
- ✅ 响应式设计
- ✅ 深色主题支持
- ✅ 虚拟滚动（VxeTable BigData）

## 📝 注意事项

### 移动端测试

1. 使用浏览器开发者工具的设备模拟器
2. 或在真实移动设备上访问开发服务器（使用 `--host` 参数）

### 性能优化

- 所有 UI 库都已配置按需加载
- Vite 已优化依赖预构建
- 使用 `shallowRef` 优化组件切换

## 🔧 故障排查

### 依赖安装失败

```bash
# 清除缓存重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 某个 UI 库样式异常

检查对应的 CSS 导入是否正确：
- Element Plus: `element-plus/dist/index.css`
- Ant Design Vue: `ant-design-vue/dist/reset.css`
- Arco Design: `@arco-design/web-vue/dist/arco.css`
- PrimeVue: `primevue/resources/themes/lara-light-blue/theme.css`

## 📚 相关链接

- [Element Plus](https://element-plus.org/)
- [VXE Table](https://vxetable.cn/)
- [Ant Design Vue](https://antdv.com/)
- [Naive UI](https://www.naiveui.com/)
- [Vuetify](https://vuetifyjs.com/)
- [Arco Design Vue](https://arco.design/vue)
- [PrimeVue](https://primevue.org/)

## 🎉 贡献

欢迎提交 PR 添加更多 UI 库示例！
