<script setup lang="ts">
import { vTableTouchScroll } from 'vue-table-touch-scroll'
import { useTableData } from '../composables/useTableData'
import { useTableColumns } from '../composables/useTableColumns'
import { VxeTable, VxeColumn } from 'vxe-table'
import { VxeUI } from 'vxe-pc-ui'
import 'vxe-table/lib/style.css'
import '../styles/common.css'
VxeUI.setTheme('dark')
const tableData = useTableData(30)
const bigTableData = useTableData(10000)
const columns = useTableColumns()
</script>

<template>
  <div class="example-container">
    <h2>VXE Table</h2>
    <p class="description">
      Powerful Vue table component with advanced features like virtual scrolling and tree structures
    </p>

    <div
      v-table-touch-scroll="{selector: '.vxe-table--body-inner-wrapper'}"
      class="table-wrapper"
    >
      <vxe-table
        :data="tableData"
        border
        stripe
        height="400"
        size="small"
      >
        <vxe-column
          v-for="col in columns"
          :key="col.key"
          :field="col.field"
          :title="col.title"
          :width="col.width"
          :fixed="col.fixed"
        />
      </vxe-table>
    </div>

    <h3 style="margin-top: 30px">Big Data Virtual Scrolling (10,000 records)</h3>
    <div
      v-table-touch-scroll="{selector: '.vxe-table--body-inner-wrapper'}"
      class="table-wrapper"
    >
      <vxe-table
        :data="bigTableData"
        border
        stripe
        height="400"
        size="small"
        :scroll-y="{ enabled: true, gt: 100 }"
      >
        <vxe-column
          v-for="col in columns"
          :key="col.key"
          :field="col.field"
          :title="col.title"
          :width="col.width"
          :fixed="col.fixed"
        />
      </vxe-table>
    </div>
  </div>
</template>
