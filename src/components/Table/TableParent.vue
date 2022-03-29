<script setup>
import Pagination from './Pagination.vue'
import Table from './Table.vue'
import { computed, reactive } from 'vue'
// TODO: check 

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
          label: 'Name', // TODO: handle text overflow
          align: 'start', // start, center, end
          sortable: true,
        },
        {
          key: 'height',
          type: 'number',
          label: 'Height',
          align: 'end',
          sortable: true,
        },
        {
          key: 'created',
          type: 'date',
          label: 'Created',
          align: 'center',
          sortable: false,
        },
      ],
      data: [
        ['luke', 'yoda'],
        [175, 65],
        ['2014-12-09T13:50:51.644000Z', '2014-12-20T21:17:56.891000Z']
      ]
    },
    validator: obj => {
      const equalHeadersColumnsLength = obj.headers.length === obj.data.length
      const equalRowsLength = [...new Set(obj.data.map(el => el.length))].length === 1
      if (!equalHeadersColumnsLength) console.error('headers and data must be the same length')
      if (!equalRowsLength) console.error('row entries must be the same length')
      return equalHeadersColumnsLength && equalRowsLength
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
    type: [String, Number],
    default: 'name', // headers[idx].key
    // validator: val => val
    // TODO: all validation
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
    default: [
      {
        key: 'name', // column header
        value: '', // filter value
        operator: 'isEqual' // isEqual, isLess, isGreater
      }
    ]
    // TODO: add filter tags validation
  }
})

// SORTING
const sortedHeaderIdx = $ref(0)
const sortedHeader = $ref(getHeaderObj(props.tableData.headers))
const sortDirection = $ref(props.defaultSortDirection)
function getHeaderObj (headers) {
  // get initial sorting header
  if (props.defaultSortByHeader) {
    sortedHeaderIdx = headers.findIndex(h => h.key === props.defaultSortByHeader)
    return headers.filter(h => h.key === props.defaultSortByHeader)[0]
  } else { // return first header element to be sorted by
    return headers[0]
  }
}
// handle user interaction: sort
function sort(newHeader, newDirection, headIdx) {
  sortedHeader = newHeader
  sortDirection = newDirection
  sortedHeaderIdx = headIdx
}

// FILTERING
const originalIdxs = $computed(() => [...Array(props.tableData.data[0].length).keys()]) // [0, 1, ...data[0].length ]
const filteredIdxs = $computed(() => {
  const allIdxs = []
  // add t0
  if (props.filterTags.length) {
    const start = performance.now()
    // get all headers corresponding to the filters 
    const filteredHeaderIdxs = props.filterTags.map(f => props.tableData.headers.findIndex(h => h.key === f.key))
    // loop over each column
    props.tableData.data.forEach((col, colIdx) => {
      // loop over the header for using multiple filters
      filteredHeaderIdxs.forEach((headIdx, filterIdx) => {
        if (headIdx !== colIdx) return
        const columnIdxs = getIdxs(col, colIdx, filterIdx)
        allIdxs.push(...columnIdxs)
      })
    })
    // trim all matching idxs and return a unique filtered set
    const unique = [...new Set(allIdxs)]
    t0 = performance.now() - start
    return unique
  } else {
    // if no filters are applied return original index array
    return originalIdxs
  }
})
// filter each column dataset and return matching idxs
function getIdxs(colData, colIdx, filterTagIdx) {
  const idxs = []
  const filterValue = props.filterTags[filterTagIdx].value
  const type = props.tableData.headers[colIdx].type
  
  colData.forEach((el, idx) => {
    switch (type) {
      case 'string':
        if (el.includes(filterValue)) idxs.push(idx)
        break;
    
      case 'number':
        const operator = props.filterTags[filterTagIdx].operator
        switch (operator) {
          case 'isEqual':
            if (el == filterValue) idxs.push(idx)
            break;
          case 'isLess':
            if (el < filterValue) idxs.push(idx)
            break;
          case 'isGreater':
            if (el > filterValue) idxs.push(idx)
            break;
        }

      case 'date':
        const toFilteredDate = new Date(filterValue)
        const date = new Date(el)
        case 'isEqual':
          if (toFilteredDate.getTime() === date.getTime()) idxs.push(idx)
          break;
        case 'isLess':
          if (date < toFilteredDate) idxs.push(idx)
          break;
        case 'isGreater':
          if (date > toFilteredDate) idxs.push(idx)
          break;
    }
  })
  return idxs
}

// SORTING
const sortedIdxs = $computed(() => {
  t1 = performance.now()
  const columnData = props.tableData.data[sortedHeaderIdx]
  const filteredColumn = filteredIdxs.map(idx => columnData[idx])
  const idxs = [...Array(filteredIdxs.length).keys()]
  if (sortedHeader.sortable) {
    idxs.sort(sortMethods(filteredColumn, sortedHeader.type))
    if (sortDirection === -1) idxs.reverse()
  }
  t2 = performance.now() - t1
  return idxs
})
function sortMethods (col, type) {
  switch (type) {
    case 'number':
      return (a, b) => col[a] - col[b]
    case 'string':
      return (a, b) => col[a] < col[b] ? -1 : col[a] > col[b] ? 1 : 0
    case 'date':
      return (a, b) => new Date(col[a]) - new Date(col[b])
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
  const data = props.tableData.headers.map((_, idx) => {
    return sortedIdxs.map(i => {
      return props.tableData.data[idx][filteredIdxs[i]]
    }).slice(pages.startIdx, pages.endIdx)
  })
  t3 = performance.now() - n
  emit('performanceTest', [t0, t2, t3])
  return data
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
    v-if="filteredIdxs.length > rowsPerPage"
    :entries="filteredIdxs.length"
    :rowsPerPage="rowsPerPage"
    @onChangePage="changePage" 
  /> 
</template>
