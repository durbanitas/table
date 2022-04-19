<script setup>
import TableParent from '../components/Table/TableParent.vue'
import Filtering from '../components/Filtering.vue'
import { onBeforeMount } from 'vue'
import { createDataset, demoStarWarsData } from '../utils/demo_data.js'

let tableData = $ref({})
let showTable = $ref(false)

const N_ROWS_PER_PAGE = 100_000
const N_COLUMNS = 20

onBeforeMount(() => {
  initTable()
})

function initTable () {
  tableData = createDataset(N_COLUMNS, N_ROWS_PER_PAGE)
  // tableData = demoStarWarsData
  showTable = true
}

// add filter tags
const filterTags = $ref([])
function useFilterTags (filters) {
  filterTags = filters
}
</script>

<template>
  <Filtering :headers="tableData.headers" @submit="useFilterTags" />
  <div v-if="showTable">
    <br>
    <TableParent :tableData="tableData" :defaultSortDirection="1" :rowsPerPage="5" :filterTags="filterTags" />
  </div>
</template>

<style>
.loading-table-size {
  height: 400px;
  border: 1px solid #ccc;
}
</style>
