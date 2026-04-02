<script setup lang="ts">
import { useTableData } from '../../composables/useTableData'
import { useTableColumns } from '../../composables/useTableColumns'
import { VxeColumn, VxeTable } from 'vxe-table'
import { VxeUI } from 'vxe-pc-ui'
import 'vxe-table/lib/style.css'

const colorMode = useColorMode()
watch(
  () => colorMode.value,
  (mode) => {
    VxeUI.setTheme(mode === 'dark' ? 'dark' : 'light')
  },
  { immediate: true }
)

const tableData = useTableData(30)
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
  selector: '.vxe-table--body-inner-wrapper',
  friction: viewerContext.friction.value,
}))
</script>

<template>
  <div
    v-mobile-table="viewerContext.isEnabled.value ? directiveOptions : false"
    class="border rounded-lg overflow-hidden"
  >
    <vxe-table :data="tableData" border stripe height="390" size="small">
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
</template>
