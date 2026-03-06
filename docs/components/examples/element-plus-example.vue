<script setup lang="ts">
import { useTableData } from '../../composables/useTableData'
import { useTableColumns } from '../../composables/useTableColumns'

const tableData = useTableData(50)
const columns = useTableColumns()
</script>

<template>
  <div
    v-table-touch-scroll="{ uiLibrary: 'element-plus' }"
    class="border rounded-lg overflow-hidden"
  >
    <el-table :data="tableData" height="390" border stripe size="small">
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
</template>
