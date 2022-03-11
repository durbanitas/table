<script setup>
import Table from './Table.vue'
import { computed } from 'vue'

const props = defineProps({
  // required props
  tableData: {
    type: Object,
    required: true,
    default: {
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
        ['luke', 'yoda'],
        [175, 65]
      ]
    },
    validator: obj => {
      const sameHeaderColumn = obj.headers.length === obj.data.length
      const equalRowsLength = [...new Set(obj.data.map(el => el.length))].length === 1
      // TODO: validate same typeof each entries
      // TODO: validate missing data?
      if (!sameHeaderColumn) console.error('headers and data must be the same length')
      if (!equalRowsLength) console.error('row entries must be the same length')
      return sameHeaderColumn && equalRowsLength
    }
  },
  // optional props
  defaultSortDirection: {
    type: Number,
    default: 1, // 1 or -1
    validator: num => {
      if (num !== 1 && num !== -1) {
        console.error('Wrong index value for: defaultSortDirection')
        return false
      }
      return true
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
      if (num < 1) {
        console.error('rowsPerPage must be greater then 0')
        return false
      }
      return true
    }
  }
})

// SORTING
const sortedHeader = $ref(getHeaderObj(props.tableData.headers))
const sortDirection = $ref(1)
// get initial sort header
// TODO: validate if default sort header is in props
function getHeaderObj (headers) {
  return headers.filter(h => h.key === props.defaultSortByHeader)[0]
}
function sort(newHeader, newDirection) {
  sortDirection = newDirection
  sortedHeader = newHeader
}

// sort methods
// TODO: simplify
const sortedArray = $computed(() => {
  const dataObjects = createMergeDataset(props.tableData.data, props.tableData.headers)
  const sortedArray = sortData(dataObjects)
  return seperate(sortedArray, props.tableData.headers)
})

function createMergeDataset(data, headers) {
  // returns [{name: 'name1', mass: 82}, {...}]
  return data[0].map((_, idx) => {
    const obj = {}
    headers.forEach((head, i) => Object.assign(obj, { [head.key]: data[i][idx] }))
    return obj
  })
}
function sortData(data) {
  // TODO: add sort direction
  // TODO: handle sorting type
  return data.sort((a, b) => {
    return ((a[sortedHeader.key] < b[sortedHeader.key]) ? -1 : ((a[sortedHeader.key] == b[sortedHeader.key]) ? 0 : 1))
  })
}
function seperate(arr, headers) {
  const tableData = []
  headers.forEach(_ => tableData.push([]))
  // push each value back to his initial nested array structure
  arr.forEach((char, i) => headers.forEach((head, idx) => tableData[idx][i] = char[head.key]))
  return tableData
}

// FILTERING

// PAGINATION

// RENDERED DATA
const filteredData = computed(() => sortedArray)
</script>

<template>
  <!-- Filtering.vue  -->
  <Table
    :headers="tableData.headers"
    :tableData="filteredData"
    :sortDirection="sortDirection"
    :sortedHeader="sortedHeader"
    :defaultSortDirection="defaultSortDirection"
    @onHeaderSort="sort"
  />
</template>
