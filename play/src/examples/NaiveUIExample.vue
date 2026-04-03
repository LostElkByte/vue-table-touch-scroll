<script setup lang="ts">
import { vMobileTable } from 'vue3-mobile-table'
import { useTableData } from '../composables/useTableData'
import { useTableColumns } from '../composables/useTableColumns'
import { NDataTable, NConfigProvider } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import '../styles/common.css'
import { darkTheme } from 'naive-ui'

const tableData = useTableData(30)
// Naive UI 的 fixed 属性会自动从列配置中读取
const columns: DataTableColumns = useTableColumns()
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <div class="example-container">
      <h2>Naive UI</h2>
      <p class="description">
        Vue 3 component library with complete TypeScript support and elegant design
      </p>

      <div
        v-mobile-table="{ selector: '.n-scrollbar-container' }"
        class="table-wrapper"
      >
        <n-data-table
          :columns="columns"
          :data="tableData"
          :scroll-x="1200"
          :max-height="400"
          :bordered="true"
          size="small"
          striped
        />
      </div>
    </div>
  </n-config-provider>
</template>
