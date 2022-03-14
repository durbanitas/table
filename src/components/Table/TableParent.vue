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
  },
  filterTags: {
    type: Array,
    // TODO: create filter tags data structure
    default: []
    // TODO: add filter tags validation
  }
})

// SORTING
// TODO: set default header idx
const sortedHeaderIdx = $ref(0)
const sortedHeader = $ref(getHeaderObj(props.tableData.headers))
const sortDirection = $ref(props.defaultSortDirection)
// get initial sorting header
// TODO: validate if default sort header is in props
function getHeaderObj (headers) {
  return headers.filter(h => h.key === 0)[0]
}
function sort(newHeader, newDirection, idx) {
  sortDirection = newDirection
  sortedHeader = newHeader
  sortedHeaderIdx = idx
}

// FILTERING
const originalIdxs = $computed(() => props.tableData.data[0].map((_, idx) => idx))
const filteredIdxs = $computed(() => {
  if (props.filterTags.length) {
    const arr = []
    const columnData = props.tableData.data[sortedHeaderIdx]
    // TODO: add multiple filters
    columnData.filter((el, idx) => {
      if (el < 6) arr.push(idx)
    })
    return arr
  } else {
    // if no filters are applied return original index array
    return originalIdxs
  }
})

const sortedIdxs = $computed(() => {
  const columnData = props.tableData.data[sortedHeaderIdx]
  const copiedData = filteredIdxs.map(idx => columnData[idx])
  const sortedIdxs = filteredIdxs.map((_, idx) => idx)
  // TODO: sort different types
  sortedIdxs.sort(sortMethods(sortedHeader.type, copiedData, sortDirection))
  return sortedIdxs
})
function sortMethods (type, data, direction) {
  switch (type) {
    case 'number':
      return (a, b) => {
        // reverse sorting
        if (direction === 1) [a, b] = [b, a]
        return data[a] < data[b] ? -1 : 1
      }
    default:
      break;
  }
}


// PAGINATION

// RENDERED DATA
const filteredData = computed(() => {
  return props.tableData.headers.map((_, idx) => {
    return sortedIdxs.map(i => {
      return props.tableData.data[idx][filteredIdxs[i]]
    })
  })
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
  <!-- Pagination.vue  -->
</template>
