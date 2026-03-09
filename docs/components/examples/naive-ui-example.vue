<script setup lang="ts">
import { useTableData } from '../../composables/useTableData'
import { useTableColumns } from '../../composables/useTableColumns'
import { NConfigProvider, NDataTable, darkTheme, lightTheme } from 'naive-ui'

import type { DataTableColumns } from 'naive-ui'

const colorMode = useColorMode()
const naiveTheme = computed(() =>
  colorMode.value === 'dark' ? darkTheme : lightTheme
)

const tableData = useTableData(30)
// Naive UI reads the fixed property automatically from column config
const columns: DataTableColumns = useTableColumns()

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
  selector: '.n-scrollbar-container' as const,
  friction: viewerContext.friction.value,
}))
</script>

<template>
  <n-config-provider :theme="naiveTheme">
    <div
      v-table-touch-scroll="
        viewerContext.isMobileMode.value ? directiveOptions : false
      "
      class="border rounded-lg overflow-hidden"
    >
      <n-data-table
        :columns="columns"
        :data="tableData"
        :scroll-x="1200"
        :max-height="340"
        :bordered="true"
        size="small"
        striped
      />
    </div>
  </n-config-provider>
</template>
