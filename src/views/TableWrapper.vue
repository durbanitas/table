<script setup>
import TableParent from '../components/Table/TableParent.vue'
import { onBeforeMount } from 'vue'
import { createDataset } from '../utils/demo_data.js'
import { getSums } from '../utils/measure.js'

let tableData = $ref({})
let showTable = $ref(false)

const N_ROWS_PER_PAGE = 10000
const N_COLUMNS = 2

onBeforeMount(() => {
  initTable()
})

const test = {
      headers: [
        {
          key: 'name', // represents data[[key1], [key2]]
          type: 'string', // string, number, date
          label: 'Name',
          align: 'start', // start, center, end
          sortable: true,
        },
        {
          key: 'height',
          type: 'number',
          label: 'Height',
          align: 'end',
          sortable: true,
        }
      ],
      data: [
        ['luke', 'yoda', 'leia', 'bob', 'mark'],
        [175, 65, 124, 12, 54]
      ]
    }

function initTable() {
  showTable = false // set to false for performance testing
  const data = createDataset(N_COLUMNS, N_ROWS_PER_PAGE)
  tableData = test
  showTable = true
}

// Performance test
const stats = []
function collectData(val) {
  stats.push(val)
}
// TODO: simplify?
// TODO: is creating data each time costly?
async function createDataAndTable(){
  initTable()
  return;
};
async function getPerformanceData(){
  await createDataAndTable();
};
function runTest (cols, rows) {
    for (let i = 0; i < 10; i++) {
      getPerformanceData()
      if (i === 9) {
        const result = getSums(stats)
        result.rows = rows
        result.columns = cols
        console.log(result);
      }
    }
}
function startTest() {
  runTest(N_COLUMNS, N_ROWS_PER_PAGE)
}
</script>

<template>
  <!-- TODO: add filter tags -->
  <div v-if="showTable">
    <TableParent
      :tableData="tableData"
      :defaultSortDirection="1"
      :defaultSortByHeader="'name'"
      :rowsPerPage="5"
      :filterTags="[]"
      @performanceTest="collectData"
    />
  </div>
  <!-- performance test -->
  <button @click="startTest()" v-text="'run test'" /> 
</template>

<style>
.loading-table-size {
  height: 400px;
  border: 1px solid #ccc;
}
</style>
