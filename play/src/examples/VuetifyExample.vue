<script setup lang="ts">
import { vMobileTable } from 'vue3-mobile-table'
import { useTableData } from '../composables/useTableData'
import { useTableColumns } from '../composables/useTableColumns'
import { computed } from 'vue'
import '../styles/common.css'

const tableData = useTableData(30)
const columns = useTableColumns()

// Vuetify 需要 width 为字符串格式，并支持 fixed 属性
const headers = computed(() =>
  columns.map((col) => ({
    title: col.title,
    key: col.key,
    minWidth: `${col.width}px`,
    ...(col.fixed && {
      fixed: (col.fixed === 'left' ? 'start' : 'end') as 'start' | 'end',
    }),
  }))
)
</script>

<template>
  <div class="example-container">
    <h2>Vuetify</h2>
    <p class="description">
      Material Design component framework with beautiful UI components
    </p>

    <div
      v-mobile-table="{ selector: '.v-table__wrapper tbody' }"
      class="table-wrapper"
    >
      <v-data-table
        theme="dark"
        size="small"
        :headers="headers"
        :items="tableData"
        height="400"
        fixed-header
        density="compact"
        :items-per-page="-1"
        hide-default-footer
      />
    </div>
  </div>
</template>
