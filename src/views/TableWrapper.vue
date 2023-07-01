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
  N_ROWS_PER_PAGE = 200
  N_COLUMNS = 12
  SHOW_ROWS_PER_PAGE = 10
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

// select pagination or virtual list
let listType = $ref('pagination')
</script>

<template>
  <div class="table-header">
    <Filtering :headers="tableData.headers" @submit="useFilterTags" />

    <div class="space-between">
      <!-- TODO: make button-group -->
      <button @click="listType = 'pagination'" :class="{ 'active': listType === 'pagination' }">Pagination</button>
      <button @click="listType = 'virtual'" :class="{ 'active': listType === 'virtual' }">Virtual</button>
    </div>
  </div>
  <div v-if="showTable" class="table-bg">
    <TableParent 
      :tableData="tableData" 
      :defaultSortDirection="1" 
      :rowsPerPage="SHOW_ROWS_PER_PAGE"
      :N_ROWS_PER_PAGE="N_ROWS_PER_PAGE"
      :filterTags="filterTags"
      :listType="listType"
    />
  </div>
</template>

<style>
.loading-table-size {
  height: 400px;
  border: 1px solid #ccc;
}
</style>
