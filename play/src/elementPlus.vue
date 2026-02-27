<script lang="ts" setup>
import { ElTable, ElTableColumn, ElButton, ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import { vTableTouchScroll } from '@vue-table-touch-scroll/core'

interface TableItem {
  id: number
  date: string
  name: string
  state: string
  city: string
  address: string
  zip: string
}

const tableData: TableItem[] = Array.from({ length: 15 }).map((_, index) => ({
  id: index + 1,
  date: `2024-05-${(index + 1).toString().padStart(2, '0')}`,
  name: `Tom ${index + 1}`,
  state: 'California',
  city: 'Los Angeles',
  address: 'No. 189, Grove St, Los Angeles',
  zip: `CA 900${index + 10}`,
}))

const handleDetail = (row: TableItem) => {
  ElMessage.success(`查看 ID: ${row.id} 的详情`)
}
</script>

<template>
  <div class="container">
    <div
      v-table-touch-scroll="{ enabled: true, selector: '.el-scrollbar__wrap' }"
    >
      <ElTable :data="tableData" style="width: 100%" height="400" border stripe>
        <ElTableColumn
          prop="id"
          label="ID"
          width="70"
          fixed="left"
          align="center"
        />
        <ElTableColumn prop="date" label="Date" width="120" />
        <ElTableColumn prop="name" label="Name" width="120" />
        <ElTableColumn prop="state" label="State" width="120" />
        <ElTableColumn prop="city" label="City" width="200" />
        <ElTableColumn prop="address" label="Address" width="500" />
        <ElTableColumn prop="zip" label="Zip" width="120" />

        <ElTableColumn
          label="Operations"
          width="120"
          fixed="right"
          align="center"
        >
          <template #default="{ row }">
            <ElButton type="primary" size="small" @click="handleDetail(row)">
              Detail
            </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </div>
</template>
