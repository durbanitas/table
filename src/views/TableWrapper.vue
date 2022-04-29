<script setup>
import TableParent from '../components/Table/TableParent.vue'
import Filtering from '../components/Filtering.vue'
import { onBeforeMount } from 'vue'
import { createDataset } from '../utils/demo_data.js'

let tableData = $ref({})
let showTable = $ref(false)

let N_ROWS_PER_PAGE
let N_COLUMNS
let SHOW_ROWS_PER_PAGE
const _DEV = import.meta.env.DEV
if (_DEV) {
  N_ROWS_PER_PAGE = 100_000
  N_COLUMNS = 20
  SHOW_ROWS_PER_PAGE = 5
} else {
  N_ROWS_PER_PAGE = 100_000
  N_COLUMNS = 20
  SHOW_ROWS_PER_PAGE = 20
}

// TODO: input validate 00045 values
// TODO: demo data add negative values
// TODO: add filter presets
// TODO: chrome -> scroll update highlight row
// TODO: pagination on small devices

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
    <TableParent :tableData="tableData" :defaultSortDirection="-1" :rowsPerPage="SHOW_ROWS_PER_PAGE"
      :filterTags="filterTags" />
  </div>
  <pre v-if="_DEV" v-text="filterTags" />
</template>

<style>
.loading-table-size {
  height: 400px;
  border: 1px solid #ccc;
}
</style>
