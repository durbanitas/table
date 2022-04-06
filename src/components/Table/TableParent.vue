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
        columnKey: 'name', // column header
        operator: 'isEqual', // isEqual, isLess, isGreater
        value: '' // filter value
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
    sortedHeaderIdx = headers.findIndex(h => h.columnKey === props.defaultSortByHeader)
    return headers.find(h => h.columnKey === props.defaultSortByHeader)
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

const originalIdxs = $computed(() => [...Array(props.tableData.data[0].length).keys()]) // [0, 1, ...data[0].length ]
const filteredIdxs = $computed(() => {
  if (props.filterTags.length) {
    // const allIdxs = []
    const start = performance.now()
    // get all headers corresponding to the filters 
    const filteredHeaderIdxs = props.filterTags.map(f => props.tableData.headers.findIndex(h => h.columnKey === f.columnKey))
    // loop over each column
    console.log(filteredHeaderIdxs);
    /*
      TODO: enable multi filter
      - add key value pair to filter: 'text': fiterA
    */
    // TODO: got additional another column filter? use filtered dataset
    const columnIdxs = getIdxs(props.tableData.data[0], 'number')
    // allIdxs.push(columnIdxs)
    // trim all matching idxs and return a unique filtered set
    // const unique = [...new Set(allIdxs.flat())]
    _timeRange1 = performance.now() - start
    return columnIdxs
  } else {
    // if no filters are applied return original index array
    return originalIdxs
  }
})

let filterA = {
  text: 'filterA',
  operator: '==',
  value: '45',
}, item = 'item';
const filterNumber = new Function(filterA.text, item,
  `return item ${filterA.operator} filterA`
);
const filterString = new Function(filterA.text, item,
  `return item.includes(filterA)`
)
function getIdxs (colData, type) {
  const arr = []
  let isMatching
  colData.filter((el, idx) => {
    switch (type) {
      case 'number':
        isMatching = filterNumber(filterA.value, el)
        if (isMatching) arr.push(idx)
        break;

      case 'string':
        isMatching = filterString(filterA.value, el)
        if (isMatching) arr.push(idx)
        break;    

      case 'date':
        const toFilteredDate = Math.floor(new Date(filterA.value).getTime() / 1000)
        const date = Math.floor(new Date(el).getTime() / 1000)
        isMatching = filterNumber(toFilteredDate, date)
        if (isMatching) arr.push(idx)
        break;    
    }
  })
  return arr
}



// SORTING
const sortedIdxs = $computed(() => {
  const n = performance.now()
  const columnData = props.tableData.data[sortedHeaderIdx]
  const filteredColumn = filteredIdxs.map(idx => columnData[idx])
  const sortFn = getSortMethod(filteredColumn, sortedHeader.type, sortDirection)
  const idxRange = [...Array(filteredIdxs.length).keys()]
  let idxs = []
  if (sortedHeader.sortable) { 
    idxRange.sort(sortFn)
    idxs = idxRange.map(i => filteredIdxs[i])
  } else {
    idxs = idxRange
  }
  _timeRange2 = performance.now() - n
  return idxs
})
function getSortMethod(col, type, direction) {
  // TODO: simplify
  if (direction === 1) {
    switch (type) {
      case 'number':
        return (a, b) => col[a] - col[b]
      case 'string':
        return (a, b) => col[a] < col[b] ? -1 : col[a] > col[b] ? 1 : 0
      case 'date':
        return (a, b) => new Date(col[a]) - new Date(col[b])
    }
  } else {
    switch (type) {
      case 'number':
        return (a, b) => col[b] - col[a]
      case 'string':
        return (a, b) => col[b] < col[a] ? -1 : col[b] > col[a] ? 1 : 0
      case 'date':
        return (a, b) => new Date(col[b]) - new Date(col[a])
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
  const rangeSortedIdxs = sortedIdxs.slice(pages.startIdx, pages.endIdx)
  const tableData = props.tableData.headers.map((_, colIdx) => {
    return rangeSortedIdxs.map(i => {
      return props.tableData.data[colIdx][i]
    })
  })
  _timeRange3 = performance.now() - n
  emit('performanceTest', [_timeRange1, _timeRange2, _timeRange3])
  return tableData
})

// performance test
let _timeRange1, _timeRange2, _timeRange3
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
