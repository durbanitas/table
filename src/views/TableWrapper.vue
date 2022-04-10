<script setup>
import TableParent from '../components/Table/TableParent.vue'
import Filtering from '../components/Filtering.vue'
import { onBeforeMount } from 'vue'
import { createDataset, demoStarWarsData } from '../utils/demo_data.js'
import { getSums } from '../utils/measure.js'

let tableData = $ref({})
let showTable = $ref(false)

const N_ROWS_PER_PAGE = 10_000
const N_COLUMNS = 5

onBeforeMount(() => {
  initTable()
})

function initTable () {
  showTable = false // set to false for performance testing
  tableData = createDataset(N_COLUMNS, N_ROWS_PER_PAGE)
  // tableData = demoStarWarsData
  showTable = true
}

// add filter tags
const filterTags = $ref([])
function useFilterTags (filters) {
  filterTags = filters
}

// Performance test
const displayOutcome = $ref('')
const stats = []
function collectData (testResults) {
  stats.push(testResults)
}
async function createDataAndTable () {
  initTable()
  return;
};
async function getPerformanceData () {
  await createDataAndTable();
};
function runTest (cols, rows) {
  for (let i = 0; i < 10; i++) {
    getPerformanceData()
    if (i === 9) {
      const result = getSums(stats)
      result.rows = rows
      result.columns = cols
      displayOutcome = result
      // console.log(result);
    }
  }
}
function startTest () {
  runTest(N_COLUMNS, N_ROWS_PER_PAGE)
}
</script>

<template>
  <div v-if="showTable">
    <Filtering :headers="tableData.headers" @submit="useFilterTags" />
    <br>
    <TableParent :tableData="tableData" :defaultSortDirection="1" :defaultSortByHeader="0" :rowsPerPage="5"
      :filterTags="filterTags" @performanceTest="collectData" />
  </div>
  <!-- performance test -->
  <button @click="startTest()" v-text="'run test'" />
  <h5 v-text="displayOutcome" />
</template>

<style>.loading-table-size {
  height: 400px;
  border: 1px solid #ccc;
}
</style>
