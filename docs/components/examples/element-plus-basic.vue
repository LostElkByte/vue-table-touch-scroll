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
    <el-table v-table-touch-scroll :data="tableData" style="width: 100%">
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
