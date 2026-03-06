<script setup lang="ts">
import { useTableData } from '../../composables/useTableData'
import { useTableColumns } from '../../composables/useTableColumns'

const tableData = useTableData(50)
const columns = useTableColumns().map(col => ({
  title: col.title,
  dataIndex: col.dataIndex,
  key: col.key,
  width: col.width,
  fixed: col.fixed,
}))
</script>

<template>
  <div class="p-4">
    <div
      v-table-touch-scroll="{ preset: 'ant-design-vue' }"
      class="border rounded-lg overflow-hidden"
    >
      <a-table
        :data-source="tableData"
        :columns="columns"
        :scroll="{ x: 1300, y: 400 }"
        size="small"
        bordered
      />
    </div>
    <p class="mt-4 text-sm text-muted-foreground text-center">
      在移动设备上触摸表格区域，体验流畅的横向滚动（50行数据）
    </p>
  </div>
</template>
