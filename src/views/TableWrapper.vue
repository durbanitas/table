<script setup>
import TableParent from '../components/Table/TableParent.vue'
import Filtering from '../components/Filtering.vue'
import SearchBar from '../components/UI/SearchBar.vue'
import { onBeforeMount } from 'vue'
import tableDataJson from '../static/jsonArr.json'

let tableData = $ref(tableDataJson)
let showTable = $ref(false)

let N_ROWS_PER_PAGE
let N_COLUMNS
let SHOW_ROWS_PER_PAGE
const _DEV = import.meta.env.DEV
if (_DEV) {
  N_ROWS_PER_PAGE = 10_000
  N_COLUMNS = 12
  SHOW_ROWS_PER_PAGE = 20
} else {
  N_ROWS_PER_PAGE = 10_000
  N_COLUMNS = 12
  SHOW_ROWS_PER_PAGE = 20
}

// TODO: input validate 00045 values
// TODO: demo data add negative values

// TODO: chrome -> scroll update highlight row
// FIXME: pagination on small devices

onBeforeMount(() => {
  initTable()
})

function initTable () {
  showTable = true
}

// add filter tags
let filterTags = $ref([])
function useFilterTags (filters) {
  filterTags = filters
}

// select pagination or virtual list
let listType = $ref('pagination')
let isLoading = $ref(false)
// TODO: add loading state for switching table types
const changeType = (newType) => {
  if (listType === newType) return
  isLoading = true
  console.log('tab ', { isLoading });
  setTimeout(() => {
    listType = newType
  }, 75);
}
const onUpdated = () => {
  isLoading = false
  console.log('hook ', {isLoading});
}

const searchQuery = $ref('')
const handleSearch = (val) => {
  searchQuery = val
}
</script>

<template>
  <div class="container pl-12 pr-12">
    <div class="table-header">
      <Filtering 
        @submit="useFilterTags"
        :headers="tableData.headers" 
      />
  
      <!-- <SearchBar @search="handleSearch" /> -->
  
      <!-- <div class="space-between">
        <button @click="changeType('pagination')" :class="{ 'active': listType === 'pagination' }">Pagination</button>
        <button @click="changeType('virtual')" :class="{ 'active': listType === 'virtual' }">Virtual</button>
      </div> -->
    </div>
  </div>
  <!-- <div >
    {{ isLoading }}
  </div> -->
  <div v-if="showTable" class="table-bg container">
    <TableParent 
      @vue:updated="onUpdated"
      :tableData="tableData" 
      :defaultSortDirection="1" 
      :rowsPerPage="SHOW_ROWS_PER_PAGE"
      :N_ROWS_PER_PAGE="N_ROWS_PER_PAGE"
      :filterTags="filterTags"
      :listType="listType"
      :searchQuery="searchQuery"
    />
  </div>
</template>
