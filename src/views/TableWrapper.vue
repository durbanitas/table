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
// TODO: chrome -> scroll update highlight row

// TODO: filters:
// - icons for button group pagination / virtual list

// TODO: table:
// virtual list bottom -> show current visible results

// TODO: add search bar

onBeforeMount(() => {
  initTable()
})

const initTable = () => {
  tableData = createDataset(N_COLUMNS, N_ROWS_PER_PAGE)
  showTable = true
}

// add filter tags
let filterTags = $ref([])
const useFilterTags = (filters) => {
  filterTags = filters
}

// select pagination or virtual list
let listType = $ref('pagination')
// TODO: add loading state for switching table types
const changeType = (newType) => {
  console.log(newType);
}
</script>

<template>
  <div class="container pl-12 pr-12">
    <div class="table-header">
      <Filtering 
        @submit="useFilterTags"
        :headers="tableData.headers" 
      />
  
      <div class="space-between">
        <button @click="changeType('pagination')" :class="{ 'active': listType === 'pagination' }">Pagination</button>
        <button 
          @click="changeType('virtual')" 
          :class="{ 'active': listType === 'virtual' }"
          class="disabled"
          disabled 
        >
          Virtual
        </button>
      </div>
    </div>
  </div>
  <div v-if="showTable" class="table-bg container">
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
