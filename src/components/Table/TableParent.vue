<script setup>
import Pagination from './Pagination.vue'
import Table from './Table.vue'
import { computed, reactive } from 'vue'

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
  if (props.defaultSortByHeader) {
    return headers.filter(h => h.key === props.defaultSortByHeader)[0]
  } else {
    return headers[0]
  }
}
function sort(newHeader, newDirection, idx) {
  sortDirection = newDirection
  sortedHeader = newHeader
  sortedHeaderIdx = idx
}

// FILTERING
const originalIdxs = $computed(() => props.tableData.data[0].map((_, idx) => idx))
const filteredIdxs = $computed(() => {
  // add t0
  if (props.filterTags.length) {
    const start = performance.now()
    const arr = []
    const columnData = props.tableData.data[sortedHeaderIdx]
    // TODO: add multiple filters
    columnData.filter((el, idx) => {
      if (el < 6) arr.push(idx)
    })
    t0 = performance.now() - start
    return arr
  } else {
    // if no filters are applied return original index array
    return originalIdxs
  }
})

const sortedIdxs = $computed(() => {
  t1 = performance.now()
  const columnData = props.tableData.data[sortedHeaderIdx]
  const copiedData = filteredIdxs.map(idx => columnData[idx])
  const idxs = filteredIdxs.map((_, idx) => idx)
  if (sortedHeader.sortable) idxs.sort(sortMethods(sortedHeader.type, copiedData, sortDirection))
  t2 = performance.now() - t1
  return idxs
})
function sortMethods (type, data, direction) {
  switch (type) {
    case 'number':
      return (a, b) => {
        // reverse sorting or use .reverse()?
        if (direction === 1) [a, b] = [b, a]
        return data[a] - data[b]
      }
    case 'string':
      return (a, b) => {
        if (direction === 1) [a, b] = [b, a]
        return data[a] < data[b] ? -1 : data[a] > data[b] ? 1 : 0
      }
    case 'date':
      return (a, b) => {
        if (direction === 1) [a, b] = [b, a]
        return new Date(data[a]) - new Date(data[b])
      }
  }
}

// PAGINATION
// slice filtered data
const selectedRows = $ref(props.rowsPerPage)
const pages = reactive({
  startIdx: 0,
  endIdx: selectedRows
})
function changePage(newPages) {
  Object.assign(pages, newPages)
}

// RENDERED DATA
const filteredData = computed(() => {
  const n = performance.now()
  const x = props.tableData.headers.map((_, idx) => {
    return sortedIdxs.map(i => {
      return props.tableData.data[idx][filteredIdxs[i]]
    }).slice(pages.startIdx, pages.endIdx)
  })
  t3 = performance.now() - n
  emit('performanceTest', [t0, t2, t3])
  return x
})

// performance test
let t0, t1, t2, t3
const emit = defineEmits(['performanceTest'])
</script>

<template>
  <!-- Filtering.vue  -->
  <Table
    :tableData="filteredData"
    :headers="tableData.headers"
    :sortedHeader="sortedHeader"
    :sortDirection="sortDirection"
    :defaultSortDirection="defaultSortDirection"
    @onHeaderSort="sort"
  />
  <Pagination
    v-if="tableData.data[0].length > rowsPerPage"
    :entries="tableData.data[0].length"
    :rowsPerPage="rowsPerPage"
    @onChangePage="changePage" 
  /> 
</template>
