<script setup>
import Controls from '../components/Controls.vue'
import TableParent from '../components/Table/TableParent.vue'

let tableData = $ref({})

const showTable = $ref(false)

function useNewDataset(data) {
  tableData = data
  showTable = true
}
</script>

<template>
  <Controls @passNewDataset="useNewDataset" />
  <!-- show table -->
  <div v-if="showTable">
    <TableParent
      :tableData="tableData"
      :defaultSortDirection="1"
      :defaultSortByHeader="'0'"
      :filterTags="[]"
      :rowsPerPage="20"
    />
  </div>
</template>

<style>
.loading-table-size {
  height: 400px;
  border: 1px solid #ccc;
}
</style>
