---
title: Element Plus
description: An example of how to use Vue Table Touch Scroll with Element Plus tables.
icon: lucide:table
---

An example of how to use Vue Table Touch Scroll with Element Plus tables to enable smooth touch scrolling on mobile devices.

## Basic Example

This example demonstrates the basic usage of Vue Table Touch Scroll with an Element Plus table component.

:::ComponentLoader{label="Basic Table" componentName="ElementPlusBasic"}
:::

```vue [BasicTable.vue]
<script setup lang="ts">
import { ref } from 'vue'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
  createdAt: string
}

const tableData = ref<User[]>([
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'Active',
    createdAt: '2024-01-16',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'User',
    status: 'Inactive',
    createdAt: '2024-01-17',
  },
  {
    id: 4,
    name: 'Alice Williams',
    email: 'alice@example.com',
    role: 'Manager',
    status: 'Active',
    createdAt: '2024-01-18',
  },
])
</script>

<template>
  <div class="table-container">
    <el-table 
      v-table-touch-scroll
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="Name" width="150" />
      <el-table-column prop="email" label="Email" width="200" />
      <el-table-column prop="role" label="Role" width="120" />
      <el-table-column prop="status" label="Status" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'Active' ? 'success' : 'info'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="Created At" width="150" />
    </el-table>
  </div>
</template>

<style scoped>
.table-container {
  width: 100%;
  overflow: hidden;
}
</style>
```

## Advanced Example with Configuration

This example shows how to customize the touch scroll behavior with configuration options.

:::ComponentLoader{label="Advanced Table" componentName="ElementPlusAdvanced"}
:::

```vue [AdvancedTable.vue]
<script setup lang="ts">
import { ref } from 'vue'

import type { TableTouchScrollOptions } from 'vue-table-touch-scroll'

interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  description: string
}

const tableData = ref<Product[]>([
  {
    id: 1,
    name: 'Laptop Pro 15',
    category: 'Electronics',
    price: 1299.99,
    stock: 45,
    description: 'High-performance laptop with 15-inch display',
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    category: 'Accessories',
    price: 29.99,
    stock: 120,
    description: 'Ergonomic wireless mouse with precision tracking',
  },
  {
    id: 3,
    name: 'USB-C Hub',
    category: 'Accessories',
    price: 49.99,
    stock: 80,
    description: 'Multi-port USB-C hub with HDMI and USB 3.0',
  },
])

const scrollOptions: TableTouchScrollOptions = {
  scrollSpeed: 1.5,
  enableMomentum: true,
  threshold: 10,
}
</script>

<template>
  <div class="table-container">
    <el-table 
      v-table-touch-scroll="scrollOptions"
      :data="tableData"
      style="width: 100%"
      stripe
      border
    >
      <el-table-column prop="id" label="ID" width="80" fixed />
      <el-table-column prop="name" label="Product Name" width="200" />
      <el-table-column prop="category" label="Category" width="150" />
      <el-table-column prop="price" label="Price" width="120">
        <template #default="{ row }">
          ${{ row.price.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="Stock" width="100">
        <template #default="{ row }">
          <el-tag :type="row.stock > 50 ? 'success' : 'warning'">
            {{ row.stock }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="Description" min-width="300" />
      <el-table-column label="Actions" width="150" fixed="right">
        <template #default>
          <el-button size="small" type="primary">Edit</el-button>
          <el-button size="small" type="danger">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.table-container {
  width: 100%;
  overflow: hidden;
}
</style>
```

## Setup

First, make sure you have Element Plus installed in your project:

:pm-install{name="element-plus"}

Then, register Element Plus in your application:

```ts [main.ts]
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueTableTouchScroll from 'vue-table-touch-scroll'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(VueTableTouchScroll)
app.mount('#app')
```

## Key Features

- **Fixed Columns**: Works seamlessly with Element Plus fixed columns
- **Striped & Bordered**: Compatible with all Element Plus table styles
- **Custom Rendering**: Supports custom cell rendering with slots
- **Tag Components**: Works with Element Plus tag and other components
- **Responsive**: Automatically adapts to different screen sizes

## Tips

1. **Width Configuration**: Set appropriate column widths to ensure horizontal scrolling works properly on mobile
2. **Fixed Columns**: Use fixed columns for important data that should always be visible
3. **Performance**: For large datasets, consider using Element Plus's built-in pagination or virtual scrolling
4. **Styling**: The directive doesn't interfere with Element Plus's styling system

## Next Steps

- Try the [Ant Design Vue](/examples/antdv) example
- Check the [API Parameters](/api/parameters) for customization options
- Read the [Troubleshooting](/guide/troubleshooting) guide if you encounter issues
