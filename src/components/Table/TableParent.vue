<script setup>
import Table from './Table.vue'
import Pagination from './Pagination.vue'
import { computed, reactive, watch } from 'vue'

const props = defineProps({
  // REQUIRED PROPS
  tableData: {
    type: Object,
    required: true,
    default: {
      headers: [
        {
          columnKey: 'name', // represents data[[key1], [key2]]
          type: 'string', // string, number, date
          label: 'Name', // TODO: handle text overflow
          align: 'start', // start, center, end
          sortable: true,
        },
        {
          columnKey: 'height',
          type: 'number',
          label: 'Height',
          align: 'end',
          sortable: true,
        },
        {
          columnKey: 'created',
          type: 'date',
          label: 'Created',
          align: 'center',
          sortable: false,
        },
      ],
      data: [
        ['luke', 'yoda'],
        [175, 65],
        [1418129410, 1419094570] // unix dateformat
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
  listType: {
    type: String,
    default: 'pagination',
    required: true
  },
  // OPTIONAL PROPS
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
    // default: 'name' // headers[idx].key
    // TODO: default values for optional properties?
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
        columnKey: 'name', // column header
        operator: '==', // '==', '<', '>'
        value: '' // filter value
      }
    ]
  },
  N_ROWS_PER_PAGE: {
    type: Number,
    default: 200
  }
})

// SORTING
let sortedHeaderIdx = $ref(0)
let sortedHeader = $ref(getHeaderObj(props.tableData.headers))
let sortDirection = $ref(props.defaultSortDirection)
// get sorting header when creating the table
function getHeaderObj (headers) {
  const { defaultSortByHeader } = props
  if (defaultSortByHeader) {
    sortedHeaderIdx = headers.findIndex(head => head.columnKey === defaultSortByHeader)
    return headers.find(head => head.columnKey === defaultSortByHeader)
  } else { // return first header element to be sorted by
    return headers[0]
  }
}
// user interaction: sort
function sort (newHeader, newDirection, headIdx) {
  sortedHeader = newHeader
  sortDirection = newDirection
  sortedHeaderIdx = headIdx
}

// FILTERING
const originalIdxs = $computed(() => [...Array(props.tableData.data[0].length).keys()]) // [0, 1, ...data[0].length ]
const filteredIdxs = $computed(() => {
  const { filterTags, tableData } = props
  // console.log(filterTags);
  // if no filters are applied, the original idxs are returned
  if (filterTags.length === 0) return originalIdxs
  let idxs = []
  const mergedFilterObj = mergeFilters(filterTags)
  Object.entries(mergedFilterObj).forEach(([colKey, filterElements], filterTagIdx) => {
    const colIdx = tableData.headers.findIndex(head => head.columnKey == colKey)
    const filters = filterElements.map(f => filterTags[f])
    const colType = tableData.headers[colIdx].type
    // compare first filter with whole column data
    if (filterTagIdx === 0) return idxs = getColFilteredIdxs(tableData.data[colIdx], filters, colType)
    // compare only the n-filtered results, not the whole column
    const filteredColData = idxs.map(dataIdx => tableData.data[colIdx][dataIdx])
    const matchingIdxs = getColFilteredIdxs(filteredColData, filters, colType)
    idxs = idxs.filter((_, matchIdx) => matchingIdxs.indexOf(matchIdx) !== -1)
  })
  return idxs
})
// mergeFilters: { columnKey: [filterIdx0, filterIdx2], columnKey: [filterIdx1] }
function mergeFilters (filters) {
  const helperObj = {}
  const keys = filters.map(f => f.columnKey)
  const uniqueKeys = [...new Set(keys)]
  uniqueKeys.forEach(key => Object.assign(helperObj, { [key]: [] }))
  filters.forEach((f, filterIdx) => helperObj[f.columnKey].push(filterIdx))
  return helperObj
}
function getColFilteredIdxs (colData, filters, type) {
  const filterMethod = getFilterMethod(filters, type)
  const filterString = `return data.map((colValue, idx) => ${filterMethod} ? idx : -1)`
  const callFilterMethod = new Function('data', filterString)
  const idxs = callFilterMethod(colData, filters)
  return idxs.filter(idx => idx !== -1)
}
function getFilterMethod (filters, type) {
  switch (type) {
    case 'number':
    case 'date':
      return filters.map(({ value, operator }) => `colValue ${operator} ${value}`).join('&&')
    case 'string':
      return filters.map(({ value }) => `colValue.toLowerCase().includes('${value.toLowerCase()}')`).join('&&')
  }
}

// SORTING
const sortedIdxs = $computed(() => {
  const columnData = props.tableData.data[sortedHeaderIdx]
  const filteredColumn = filteredIdxs.map(dataIdx => columnData[dataIdx])
  const sortFn = getSortMethod(filteredColumn, sortedHeader.type, sortDirection)
  const idxRange = [...Array(filteredIdxs.length).keys()]
  let idxs = []
  if (sortedHeader.sortable) {
    idxRange.sort(sortFn)
    idxs = idxRange.map(dataIdx => filteredIdxs[dataIdx])
  } else {
    idxs = idxRange
  }
  return idxs
})
function getSortMethod (col, type, direction) {
  if (direction === 1) {
    switch (type) {
      case 'number':
      case 'date':
        return (a, b) => col[a] - col[b]
      case 'string':
        return (a, b) => col[a] < col[b] ? -1 : col[a] > col[b] ? 1 : 0
    }
  } else {
    switch (type) {
      case 'number':
      case 'date':
        return (a, b) => col[b] - col[a]
      case 'string':
        return (a, b) => col[b] < col[a] ? -1 : col[b] > col[a] ? 1 : 0
    }
  }
}

// PAGINATION
// slice filtered data
let selectedRows = $ref(props.rowsPerPage)
let pages = reactive({
  startIdx: 0,
  endIdx: selectedRows
})
function changePage (newPages) {
  Object.assign(pages, newPages)
}

const trimList = (val) => {
  // console.log({ val });
  Object.assign(pages, val)
}

// RENDERING
const filteredData = computed(() => {
  const rangeSortedIdxs = sortedIdxs.slice(pages.startIdx, pages.endIdx)
  return props.tableData.headers.map((_, colIdx) => {
    return rangeSortedIdxs.map(dataIdx => {
      return props.tableData.data[colIdx][dataIdx]
    })
  })
})

watch(
  () => props.listType,
  (newVal) => {
    if (newVal === 'pagination') {
      pages.startIdx = 0,
      pages.endIdx = props.rowsPerPage
    } else {
      pages.endIdx = props.N_ROWS_PER_PAGE
    }
  }
)
</script>

<template>
  <Table 
    @onHeaderSort="sort"
    @trimVirtualList="trimList"
    :tableData="filteredData" 
    :headers="tableData.headers" 
    :sortedHeader="sortedHeader"
    :sortDirection="sortDirection" 
    :defaultSortDirection="defaultSortDirection"
    :listType="listType"
    :tableItemsCount="filteredIdxs.length"
    :sortedIdxs="sortedIdxs"
  />
  <Pagination 
    v-if="listType == 'pagination'"
    @onChangePage="changePage" 
    :entries="filteredIdxs.length" 
    :rowsPerPage="rowsPerPage" 
  />
</template>
