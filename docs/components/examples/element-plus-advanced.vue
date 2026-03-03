<script setup lang="ts">
import { ref } from 'vue'

import type { TableTouchScrollOptions } from '@vue-table-touch-scroll/core'

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
  enabled: true,
  threshold: 10,
  uiLibrary: 'element-plus',
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
        <template #default="{ row }"> ${{ row.price.toFixed(2) }} </template>
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
