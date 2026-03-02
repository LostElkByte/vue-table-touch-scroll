<script setup lang="ts">
import { vTableTouchScroll } from '@vue-table-touch-scroll/core'
import { useTableData } from '../composables/useTableData'
import { useTableColumns } from '../composables/useTableColumns'
import { ElTable, ElTableColumn } from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '../styles/common.css'

const tableData = useTableData(30)
const columns = useTableColumns()
</script>

<template>
  <div class="example-container">
    <h2>Element Plus</h2>
    <p class="description">Enterprise-level UI component library with rich table features</p>

    <!-- 使用 uiLibrary 预设方式（推荐） -->
    <!-- 也可以使用 selector 方式: { selector: '.el-scrollbar__wrap' } -->
    <div
      v-table-touch-scroll="{ uiLibrary: 'element-plus' }"
      class="table-wrapper"
    >
      <el-table
      class="dark"
        :data="tableData"
        height="400"
        border
        stripe
        size="small"
      >
        <el-table-column
          v-for="col in columns"
          :key="col.key"
          :prop="col.dataIndex"
          :label="col.title"
          :width="col.width"
          :fixed="col.fixed"
        />
      </el-table>
    </div>
  </div>
</template>

<style>
html.dark {
  /* 自定义深色背景颜色 */
  --el-bg-color: #626aef;
}
</style>
