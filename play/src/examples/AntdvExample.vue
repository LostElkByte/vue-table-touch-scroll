<script setup lang="ts">
import { vMobileTable } from 'vue3-mobile-table'
import { useTableData } from '../composables/useTableData'
import { useTableColumns } from '../composables/useTableColumns'
import { Table as ATable, theme, ConfigProvider } from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import '../styles/common.css'
import { computed } from 'vue'

const { darkAlgorithm, compactAlgorithm } = theme
const darkTheme = computed(() => ({
  algorithm: [darkAlgorithm, compactAlgorithm],
}))

const tableData = useTableData(30)
const columns = useTableColumns()
</script>

<template>
  <config-provider :theme="darkTheme">
    <div class="example-container">
      <h2>Ant Design Vue</h2>
      <p class="description">
        Enterprise-level UI design language and Vue implementation with rich table features
      </p>

      <!-- 使用 preset 预设方式（推荐） -->
      <!-- 也可以使用 selector 方式: { selector: '.ant-table-body' } -->
      <div
        v-mobile-table="{ preset: 'ant-design-vue' }"
        class="table-wrapper"
      >
        <a-table
          :columns="columns"
          :data-source="tableData"
          :scroll="{ x: 1200, y: 400 }"
          :pagination="false"
          row-key="id"
          size="small"
          bordered
        />
      </div>
    </div>
  </config-provider>
</template>
