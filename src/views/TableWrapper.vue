<script setup>
import Controls from '../components/Controls.vue'
import TableParent from '../components/Table/TableParent.vue'

let tableData = $ref({})
let showTable = $ref(false)

function useDemoDataset(data) {
  tableData = data
  showTable = true
}
</script>

<template>
  <Controls @passNewDataset="useDemoDataset" />
  <!-- TODO: add filter tags -->
  <div v-if="showTable">
    <TableParent
      :tableData="tableData"
      :defaultSortDirection="-1"
      :defaultSortByHeader="'Col2'"
      :rowsPerPage="5"
      :filterTags="[]"
    />
  </div>
</template>

<style>
.loading-table-size {
  height: 400px;
  border: 1px solid #ccc;
}
</style>
