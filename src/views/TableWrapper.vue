<script setup>
import TableParent from '../components/Table/TableParent.vue'
import Filtering from '../components/Filtering.vue'
import { onBeforeMount } from 'vue'
import { createDataset } from '../utils/demo_data.js'

let tableData = $ref({})
let showTable = $ref(false)

const N_ROWS_PER_PAGE = 10_000
const N_COLUMNS = 20

// TODO: demo data add negative values
// TODO: add filter presets

onBeforeMount(() => {
  initTable()
})

function initTable () {
  tableData = createDataset(N_COLUMNS, N_ROWS_PER_PAGE)
  showTable = true
}

// add filter tags
let filterTags = $ref([])
function useFilterTags (filters) {
  filterTags = filters
}
</script>

<template>
  <Filtering :headers="tableData.headers" @submit="useFilterTags" />
  <div v-if="showTable" class="table-bg">
    <TableParent :tableData="tableData" :defaultSortDirection="1" :rowsPerPage="5" :filterTags="filterTags" />
    <!-- <pre v-text="filterTags" /> -->
  </div>
</template>

<style>
.loading-table-size {
  height: 400px;
  border: 1px solid #ccc;
}
</style>
