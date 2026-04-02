const e=`<script setup lang="ts">
import { computed } from 'vue'
import { useTableData } from '../../composables/useTableData'
import { useTableColumns } from '../../composables/useTableColumns'
import { Table as ATable, ConfigProvider, theme } from 'ant-design-vue'

const { darkAlgorithm, compactAlgorithm, defaultAlgorithm } = theme
const colorMode = useColorMode()
const antTheme = computed(() => ({
  algorithm:
    colorMode.value === 'dark'
      ? [darkAlgorithm, compactAlgorithm]
      : [defaultAlgorithm, compactAlgorithm],
}))

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
  preset: 'ant-design-vue' as const,
  friction: viewerContext.friction.value,
}))
<\/script>

<template>
  <ConfigProvider :theme="antTheme">
    <div
      v-mobile-table="viewerContext.isEnabled.value ? directiveOptions : false"
      class="border rounded-lg overflow-hidden"
    >
      <a-table
        :columns="columns"
        :data-source="tableData"
        :scroll="{ x: 1200, y: 360 }"
        :pagination="false"
        row-key="id"
        size="small"
        bordered
      />
    </div>
  </ConfigProvider>
</template>
`;export{e as default};
