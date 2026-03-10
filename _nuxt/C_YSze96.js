const e=`<script setup lang="ts">
import { useTableData } from '../../composables/useTableData'
import { useTableColumns } from '../../composables/useTableColumns'

const tableData = useTableData(50)
const columns = useTableColumns()

// Get control bar state from parent component
const viewerContext = inject<{
  isMobileMode: Ref<boolean>
  friction: Ref<number>
}>('viewerContext', {
  isMobileMode: ref(true),
  friction: ref(0.95),
})

// Directive options
const directiveOptions = computed(() => ({
  preset: 'element-plus' as const,
  friction: viewerContext.friction.value,
}))
<\/script>

<template>
  <div
    v-table-touch-scroll="
      viewerContext.isMobileMode.value ? directiveOptions : false
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
`;export{e as default};
