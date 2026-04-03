<script setup lang="ts">
import { vMobileTable } from 'vue3-mobile-table'
import { useTableData } from '../composables/useTableData'
import { useTableColumns } from '../composables/useTableColumns'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import '../styles/common.css'

const tableData = useTableData(30)
const columns = useTableColumns()
</script>

<template>
  <div class="example-container">
    <h2>PrimeVue</h2>
    <p class="description">
      Rich Vue UI component library with over 90 components
    </p>

    <div
      v-mobile-table="{ selector: '.p-datatable-table-container' }"
      class="table-wrapper"
    >
      <DataTable
        :value="tableData"
        :scrollable="true"
        scroll-height="400px"
        striped-rows
        size="small"
      >
        <Column
          v-for="col in columns"
          :key="col.key"
          :field="col.field"
          :header="col.title"
          :style="{ minWidth: `${col.width}px` }"
          :frozen="col.fixed === 'left'"
          :alignFrozen="
            col.fixed === 'left'
              ? 'start'
              : col.fixed === 'right'
                ? 'end'
                : undefined
          "
        />
      </DataTable>
    </div>
  </div>
</template>
