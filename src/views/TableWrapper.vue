<script setup>
import TableParent from '../components/Table/TableParent.vue'
import Filtering from '../components/Filtering.vue'
import SearchBar from '../components/SearchBar.vue'
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
  N_COLUMNS = 15
  SHOW_ROWS_PER_PAGE = 10
} else {
  N_ROWS_PER_PAGE = 100_000
  N_COLUMNS = 10
  SHOW_ROWS_PER_PAGE = 20
}

// TODO: input validate 00045 values

onBeforeMount(() => {
  initTable()
})

const initTable = () => {
  tableData = createDataset(N_COLUMNS, N_ROWS_PER_PAGE)
  showTable = true
}

// add filter tags
let filterTags = $ref([])
const useFilterTags = filters => {
  filterTags = filters
}

const searchQuery = $ref('')
const handleSearch = query => {
  searchQuery = query
}
</script>

<template>
  <div class="container pl-12 pr-12">
    <div class="table-header">
      <div class="space-between">
        <Filtering 
          @submit="useFilterTags"
          :headers="tableData.headers" 
        />
  
        <SearchBar @search="handleSearch" />
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
      :searchQuery="searchQuery"
    />
  </div>
</template>
