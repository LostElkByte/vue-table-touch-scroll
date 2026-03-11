<script setup lang="ts">
import { vTableTouchScroll } from 'vue-table-touch-scroll'
import { useTableData } from '../composables/useTableData'
import { useTableColumns } from '../composables/useTableColumns'
import { Table as ATable } from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
import '../styles/common.css'

const tableData = useTableData(30)
const columns = useTableColumns()

document.body.setAttribute('arco-theme', 'dark');
</script>

<template>
  <div class="example-container">
    <h2>Arco Design Vue</h2>
    <p class="description">Enterprise-level design system by ByteDance with comprehensive component library</p>

    <div
      v-table-touch-scroll="{ selector: '.arco-table-body' }"
      class="table-wrapper"
    >
      <a-table
        :columns="columns"
        :data="tableData"
        :scroll="{ x: 1200, y: 400 }"
        :pagination="false"
        size="small"
        bordered
        stripe
      />
    </div>
  </div>
</template>
