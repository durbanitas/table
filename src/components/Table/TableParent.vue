<script setup>
import Table from './Table.vue'
import Pagination from './Pagination.vue'
import { computed } from 'vue'

const props = defineProps({
  // required props
  headers: {
    type: Array,
    required: true,
    default: ['name', 'height', 'mass'],
    validator: arr => {
      const gotLength = arr.length
      if (!gotLength) console.error('Please provide a length for: headers')
      return gotLength
    },
  },
  tableData: {
    type: Array,
    required: true,
    default: [
      ['luke', 'yoda'],
      [175, 65],
      [89, 45]
    ],
    validator: arr => {
      const gotLength = arr.length
      if (!gotLength) console.error('Please provide a length for: tableData')
      // TODO: validate nested array
      return gotLength
    },
  },
  // optional props
  defaultSortDirection: {
    type: Number,
    default: 1, // 1 or -1
    validator: num => {
      const isIndice = num === 1 || num === -1
      if (!isIndice) console.error('Wrong index value for: defaultSortDirection')
      return isIndice
    }
  },
  defaultSortByHeader: {
    type: String,
    default: 'name',
    // validator: val => val
  },
  rowsPerPage: {
    type: Number,
    default: 10,
    validator: num => {
      const isOverZero = num > 1
      if (!isOverZero) console.error('rowsPerPage must be greater then 0');
      return isOverZero
    }
  }
})

// SORTING
const sortedHeader = $ref(props.defaultSortByHeader)
const sortDirection = $ref(1)
function sort(newHeader, newDirection) {
  sortDirection = newDirection
  sortedHeader = newHeader
}
// sort methods
// TODO: use sort key
const sortMethod = (type, head, direction) => {
  switch (type) {
    case 'String':
      return direction === 1 ?
          (char1, char2) => char2[head] > char1[head] ? -1 : char1[head] > char2[head] ? 1 : 0 :
          (char1, char2) => char1[head] > char2[head] ? -1 : char2[head] > char1[head] ? 1 : 0 
    case 'Number':
      return direction === 1 ?
        (char1, char2) => Number(char2[head]) - Number(char1[head]) :
        (char1, char2) => Number(char1[head]) - Number(char2[head])
    case 'Date':
      return direction === 1 ?
        (char1, char2) => new Date(char2[head]) - new Date(char1[head]) :
        (char1, char2) => new Date(char1[head]) - new Date(char2[head])
  }
}
const sortedArray = $computed(() => {
  // get index of sorted header
  // sort the column data
  // get new arranged indices
  // create copies of the tableData
  // rearrange all other columns based on the new indices
  // return data

  const headIdx = props.headers.indexOf(props.defaultSortByHeader)
  // TODO: handle sorting
  const sortedArr = [...props.tableData[headIdx]].sort()
  const newIndices = sortedArr.map(el => props.tableData[headIdx].indexOf(el))

  const copiedArr = [...props.tableData]
  // re-arrange nested data
  return copiedArr
})
// FILTERING

// PAGINATION
// slice filtered data
const selectedRows = $ref(props.rowsPerPage)
const pages = $ref({
  startIdx: 0,
  endIdx: selectedRows
})
function changePage(val) {
  pages = val
}

// RENDERED DATA
const filteredData = computed(() => {
  // return filtered and sorted data
  return sortedArray
})
</script>

<template>
  <!-- Filtering.vue  -->
  <Table
    :headers="headers"
    :tableData="filteredData"
    :sortDirection="sortDirection"
    :sortedHeader="sortedHeader"
    :defaultSortDirection="defaultSortDirection"
    @onHeaderSort="sort"
  />
  <Pagination
    v-if="tableData.length > rowsPerPage"
    :entries="tableData.length"
    :selectedRows="rowsPerPage"
    @onChangePage="changePage"
  />
</template>
