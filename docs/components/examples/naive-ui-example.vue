<script setup lang="ts">
import { type TableRow, useTableData } from '../../composables/useTableData'
import { useTableColumns } from '../../composables/useTableColumns'

import type { DataTableColumns } from 'naive-ui'

const tableData = useTableData(50)
const rawColumns = useTableColumns()

const columns: DataTableColumns<TableRow> = rawColumns.map((col) => ({
  title: col.title,
  key: col.key,
  width: col.width,
  fixed: col.fixed,
}))
</script>

<template>
  <div class="p-4">
    <div
      v-table-touch-scroll="{ preset: 'naive-ui' }"
      class="border rounded-lg overflow-hidden"
    >
      <n-data-table
        :columns="columns"
        :data="tableData"
        :scroll-x="1300"
        :max-height="400"
        size="small"
        bordered
      />
    </div>
    <p class="mt-4 text-sm text-muted-foreground text-center">
      在移动设备上触摸表格区域，体验流畅的横向滚动（50行数据）
    </p>
  </div>
</template>
