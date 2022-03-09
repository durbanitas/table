<script setup>
import Table from './Table.vue'
import Pagination from './Pagination.vue'
import { computed } from 'vue'

const props = defineProps({
  // required props
  headers: {
    type: Array,
    required: true,
    default: [
        {
          key: 'name',
          type: 'String',
          label: 'Name',
          align: 'start', // start, center, end
          sortable: true,
        },
        {
          key: 'height',
          type: 'Number',
          label: 'Height (cm)',
          sortable: true,
        },
        {
          key: 'edited',
          type: 'Date',
          label: 'Edited',
          format: (date) => new Date(date).toLocaleDateString(),
          sortable: false,
        }
    ],
    validator: arr => {
      const gotLength = arr.length
      if (!gotLength) console.error('Please provide a length for: headers')
      // TODO: validate keys
      return gotLength
    },
  },
  tableData: {
    type: Array,
    required: true,
    default: [
      {
        'name': 'Luke Skywalker',
        'height': 175,
        'created': '2014-12-09T13:50:51.644000Z'
      }
    ],
    validator: arr => {
      const gotLength = arr.length
      if (!gotLength) console.error('Please provide a length for: tableData')
      // TODO: validate keys
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
    type: Number,
    default: 1, // references to headers index
    // Use type String? like 'name'?
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
const sortedHeader = $ref(props.headers[props.defaultSortByHeader])
const sortDirection = $ref(1)
function sort(headObj, newDirection) {
  sortDirection = newDirection
  sortedHeader = headObj
}
// sort methods
// TODO: sort key
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
  const type = sortedHeader.type
  const head = sortedHeader.key
  // return filtered and sorted data
  return props.tableData.sort(sortMethod(type, head, sortDirection)).slice(pages.startIdx, pages.endIdx)
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
