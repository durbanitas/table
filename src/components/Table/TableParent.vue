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
          key: 'name',
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
      const sameDataRowLength = [...new Set(obj.data.map(el => el.length))].length === 1
      // TODO: validate same typeof each entries
      if (!sameHeaderColumn) console.error('headers and data must be the same length')
      if (!sameDataRowLength) console.error('row entries must be the same length')
      return sameHeaderColumn && sameDataRowLength
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
  return headers.filter(head => head.key === props.defaultSortByHeader)[0]
}
function sort(newHeader, newDirection) {
  sortDirection = newDirection
  sortedHeader = newHeader
}
function getHeaderIdx (headers, key) {
  return headers.map(el => el.key).indexOf(key)
}

// sort methods
const sortedArray = $computed(() => {
  const headIdx = getHeaderIdx(props.tableData.headers, sortedHeader.key)
  const columnData = props.tableData.data[headIdx].slice().sort()
  console.log(columnData);
  return columnData

})

// const sortedArray = $computed(() => {
//   // get index of sorted header
//   // sort the column data
//   // get new arranged indices
//   // create copies of the tableData
//   // rearrange all other columns based on the new indices
//   // return data

//   const headIdx = props.tableData.headers.indexOf(props.sortedHeader)
//   // TODO: handle sorting
//   const sortedArr = [...props.tableData.data[headIdx]].sort()
//   const newIndices = sortedArr.map(el => props.tableData.data[headIdx].indexOf(el))

//   const copiedArr = [...props.tableData.data]
//   // re-arrange nested data
//   return copiedArr
// })
// FILTERING

// PAGINATION

// RENDERED DATA
const filteredData = computed(() => {
  // return filtered and sorted data
  return props.tableData.data
})
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
