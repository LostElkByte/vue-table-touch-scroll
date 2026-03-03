---
title: Ant Design Vue
description: An example of how to use Vue Table Touch Scroll with Ant Design Vue tables.
icon: lucide:table
---

An example of how to use Vue Table Touch Scroll with Ant Design Vue (antdv) tables to enable smooth touch scrolling on mobile devices.

## Basic Example

This example demonstrates the basic usage of Vue Table Touch Scroll with an Ant Design Vue table component.

```vue [BasicTable.vue]
<script setup lang="ts">
import { ref } from 'vue'

interface DataItem {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: 100,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    width: 300,
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    width: 200,
  },
]

const dataSource = ref<DataItem[]>([
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['developer', 'senior'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['designer'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['manager', 'team-lead'],
  },
])
</script>

<template>
  <div class="table-container">
    <a-table 
      v-table-touch-scroll
      :columns="columns"
      :data-source="dataSource"
      :scroll="{ x: 750 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'tags'">
          <a-tag
            v-for="tag in record.tags"
            :key="tag"
            :color="tag === 'developer' ? 'blue' : tag === 'designer' ? 'green' : 'orange'"
          >
            {{ tag.toUpperCase() }}
          </a-tag>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped>
.table-container {
  width: 100%;
  overflow: hidden;
}
</style>
```

## Advanced Example with Fixed Columns

This example shows how to use Vue Table Touch Scroll with Ant Design Vue's fixed columns feature.

```vue [AdvancedTable.vue]
<script setup lang="ts">
import { ref } from 'vue'

import type { TableTouchScrollOptions } from 'vue-table-touch-scroll'

interface Employee {
  key: string
  id: number
  name: string
  department: string
  position: string
  email: string
  phone: string
  salary: number
  status: string
}

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
    fixed: 'left',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 150,
    fixed: 'left',
  },
  {
    title: 'Department',
    dataIndex: 'department',
    key: 'department',
    width: 150,
  },
  {
    title: 'Position',
    dataIndex: 'position',
    key: 'position',
    width: 180,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    width: 220,
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone',
    width: 150,
  },
  {
    title: 'Salary',
    dataIndex: 'salary',
    key: 'salary',
    width: 120,
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    width: 120,
  },
  {
    title: 'Action',
    key: 'action',
    fixed: 'right',
    width: 150,
  },
]

const dataSource = ref<Employee[]>([
  {
    key: '1',
    id: 1001,
    name: 'John Brown',
    department: 'Engineering',
    position: 'Senior Developer',
    email: 'john.brown@company.com',
    phone: '+1 234-567-8901',
    salary: 85000,
    status: 'Active',
  },
  {
    key: '2',
    id: 1002,
    name: 'Jane Smith',
    department: 'Design',
    position: 'Lead Designer',
    email: 'jane.smith@company.com',
    phone: '+1 234-567-8902',
    salary: 78000,
    status: 'Active',
  },
  {
    key: '3',
    id: 1003,
    name: 'Bob Johnson',
    department: 'Marketing',
    position: 'Marketing Manager',
    email: 'bob.johnson@company.com',
    phone: '+1 234-567-8903',
    salary: 72000,
    status: 'On Leave',
  },
])

const scrollOptions: TableTouchScrollOptions = {
  scrollSpeed: 1.3,
  enableMomentum: true,
  threshold: 12,
}
</script>

<template>
  <div class="table-container">
    <a-table 
      v-table-touch-scroll="scrollOptions"
      :columns="columns"
      :data-source="dataSource"
      :scroll="{ x: 1300 }"
      bordered
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'salary'">
          <span style="font-weight: 600;">
            ${{ record.salary.toLocaleString() }}
          </span>
        </template>
        <template v-else-if="column.key === 'status'">
          <a-tag :color="record.status === 'Active' ? 'green' : 'orange'">
            {{ record.status }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="primary" size="small">Edit</a-button>
            <a-button danger size="small">Delete</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
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

First, make sure you have Ant Design Vue installed in your project:

:pm-install{name="ant-design-vue"}

Then, register Ant Design Vue in your application:

```ts [main.ts]
import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import VueTableTouchScroll from 'vue-table-touch-scroll'
import App from './App.vue'

const app = createApp(App)
app.use(Antd)
app.use(VueTableTouchScroll)
app.mount('#app')
```

## Key Features

- **Fixed Columns**: Full support for Ant Design Vue's fixed column feature
- **Bordered Tables**: Works with bordered and borderless table styles
- **Custom Slots**: Compatible with Ant Design Vue's slot-based customization
- **Scroll Configuration**: Works alongside Ant Design Vue's scroll prop
- **Responsive Design**: Automatically adapts to mobile and desktop viewports

## Tips

1. **Scroll Width**: Always set the `scroll.x` prop to enable horizontal scrolling
   ```vue
   <a-table :scroll="{ x: 1000 }" ... />
   ```

2. **Fixed Columns**: Use `fixed: 'left'` or `fixed: 'right'` in column definitions for important columns
   ```ts
   {
     title: 'Name',
     dataIndex: 'name',
     fixed: 'left',
     width: 150,
   }
   ```

3. **Column Widths**: Specify widths for all columns to ensure predictable scrolling behavior

4. **Performance**: For large datasets, enable Ant Design Vue's virtual scrolling:
   ```vue
   <a-table :scroll="{ x: 1000, y: 400 }" virtual ... />
   ```

## Compatibility Notes

- Works with Ant Design Vue 3.x and 4.x
- Compatible with all table features including sorting, filtering, and selection
- Supports both light and dark themes
- No conflicts with Ant Design Vue's built-in scroll handling

## Next Steps

- Try the [Element Plus](/examples/element-plus) example
- Check the [API Parameters](/api/parameters) for customization options
- Read the [Troubleshooting](/guide/troubleshooting) guide if you encounter issues
