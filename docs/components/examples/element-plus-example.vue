<script setup lang="ts">
import { useTableData } from '../../composables/useTableData'
import { useTableColumns } from '../../composables/useTableColumns'

const tableData = useTableData(50)
const columns = useTableColumns()

const viewerContext = inject<{
  isEnabled: Ref<boolean>
  friction: Ref<number>
}>('viewerContext', {
  isEnabled: ref(true),
  friction: ref(0.95),
})

// Directive options
const directiveOptions = computed(() => ({
  preset: 'element-plus' as const,
  friction: viewerContext.friction.value,
}))
</script>

<template>
  <div
    v-table-touch-scroll="
      viewerContext.isEnabled.value ? directiveOptions : false
    "
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
