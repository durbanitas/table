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
  // OPTIONAL PROPS
  defaultSortDirection: {
    type: Number,
    default: 1, // 1 || -1
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
        operator: '==', // '==' || '<' || '>'
        value: '' // filter value
      }
    ]
  },
  N_ROWS_PER_PAGE: {
    type: Number,
    default: 200
  },
  searchQuery: {
    type: [Number, String],
    default: ''
  },
})

// *==================================================*
// *--------- INIT and USER INTERACTION --------------*
// *==================================================*
let sortedHeaderIdx = $ref(0)
let sortedHeader = $ref(getHeaderObj(props.tableData.headers))
let sortDirection = $ref(props.defaultSortDirection)

// ------------------------------------------------
// get sorting header when creating the table
// ------------------------------------------------
function getHeaderObj (headers) {
  const { defaultSortByHeader } = props
  if (defaultSortByHeader) {
    sortedHeaderIdx = headers.findIndex(head => head.columnKey === defaultSortByHeader)
    return headers.find(head => head.columnKey === defaultSortByHeader)
  } else {
    // return first header element to be sorted by
    return headers[0]
  }
}

// ------------------------------------------------
// User interaction: sort
// ------------------------------------------------
const sort = (newHeader, newDirection, headIdx) => {
  sortedHeader = newHeader
  sortDirection = newDirection
  sortedHeaderIdx = headIdx
}

// *==================================================*
// *--------- ORIGINAL DATA --------------------------*
// *==================================================*
const originalIdxs = $computed(() => [...Array(props.tableData.data[0].length).keys()]) // [0, 1, ...data[0].length ]

// *==================================================*
// *--------- FILTERING ------------------------------*
// *==================================================*
const filteredIdxs = $computed(() => {
  const { filterTags, tableData } = props

  if (filterTags.length === 0) {
    return originalIdxs
  }

  return Object.entries(mergeFilters(filterTags)).reduce((idxs, [colKey, filterElements], filterTagIdx) => {
    const colIdx = tableData.headers.findIndex(head => head.columnKey == colKey)
    const filters = filterElements.map(f => filterTags[f])
    const colType = tableData.headers[colIdx].type

    if (filterTagIdx === 0) {
      return getColFilteredIdxs(tableData.data[colIdx], filters, colType)
    }

    const filteredColData = idxs.map(dataIdx => tableData.data[colIdx][dataIdx])
    const matchingIdxs = getColFilteredIdxs(filteredColData, filters, colType)
    return idxs.filter((_, matchIdx) => matchingIdxs.indexOf(matchIdx) !== -1)
  }, [])
})

// ------------------------------------------------
// mergeFilters returns: { columnKey: [filterIdx0, filterIdx2], columnKey: [filterIdx1] }
// ------------------------------------------------
function mergeFilters(filters) {
  const helperObj = {}
  const uniqueKeys = [...new Set(filters.map(f => f.columnKey))]

  for (const key of uniqueKeys) {
    helperObj[key] = []
  }

  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i]
    helperObj[filter.columnKey] ??= [] // use nullish coalescing operator (??=) to assign an empty array if the key does not exist
    helperObj[filter.columnKey].push(i)
  }

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

// *==================================================*
// *--------- SEARCHING ------------------------------*
// *==================================================*

// ------------------------------------------------
// get type of the searchQuery (str or num) to search 
// only columns with the same type
// ------------------------------------------------
const searchType = $computed(() => {
  const { searchQuery } = props
  const isNumber = !isNaN(searchQuery)
  const isFloat = isNumber && searchQuery.includes('.')
  return (isNumber || isFloat) ? 'number' : 'string'
})

// ------------------------------------------------
// get indexes with matching characters
// ------------------------------------------------
const searchIdxs = $computed(() => {
  if (props.searchQuery.length === 0) {
    return filteredIdxs
  }
  const idxs = []

  const isNum = isNumber(props.searchQuery)
  const isFloat = isFloatNum(props.searchQuery)
  const { headers, data } = props.tableData
  if (isNum || isFloat) {
    const colIdxs = []

    for (let i = 0; i < headers.length; i++) {
      if (headers[i].type === 'number') colIdxs.push(i)
    }
    const isFloat = isNumber && props.searchQuery.includes('.')
    const x = isFloat && props.searchQuery[0] === '.' ? props.searchQuery.split('.')[1] : props.searchQuery
    let searchValue = Number(x)

    let remainingIdxs = []

    colIdxs.forEach((colIdx, idx) => {
      // get over first array and get matching idxs
      if (idx === 0) {
        filteredIdxs.forEach((val, rowIdx) => {
          const gotMatch = checkForNumMatch(val, searchValue)
          if (gotMatch) {
            idxs.push(rowIdx)
          } else {
            remainingIdxs.push(rowIdx)
          }
        })
      } else {
        remainingIdxs.forEach(rowIdx => {
          const val = data[colIdx][rowIdx]
          const gotMatch = checkForNumMatch(val, searchValue)
          if (gotMatch) {
            idxs.push(rowIdx)
          }
        })
      }
    })
  } else {
    const colIdxs = []
    const searchValue = props.searchQuery.toLowerCase()

    for (let i = 0; i < headers.length; i++) {
      if (headers[i].type === 'string') colIdxs.push(i)
    }

    let remainingIdxs = []

    colIdxs.forEach((colIdx, idx) => {
      // loop over first array and get matching idxs
      if (idx === 0) {
        data[colIdx].forEach((val, rowIdx) => {
          const gotMatch = checkForStrMatch(val, searchValue)
          if (gotMatch) {
            idxs.push(rowIdx)
          } else {
            remainingIdxs.push(rowIdx)
          }
        })
      } else {
        remainingIdxs.forEach(rowIdx => {
          const val = data[colIdx][rowIdx]
          const gotMatch = checkForStrMatch(val, searchValue)
          if (gotMatch) {
            idxs.push(rowIdx)
          } else {
            // remainingIdxs.push(rowIdx)
          }
        })
      }
    })
  }
  
  // TODO: optimize
  return [...new Set(idxs)]
})

function isNumber(str) {
  return !isNaN(str)
}
function isFloatNum (str) {
  return isNumber && str.includes('.')
}
function checkForNumMatch(val, query, type) {
  const currentVal = val.toString()
  return currentVal.includes(query.toString())
}
function checkForStrMatch(val, query, type) {
  const currentVal = val.toLowerCase()
  return currentVal.includes(query.toString())
}

// *==================================================*
// *--------- SORTING --------------------------------*
// *==================================================*
const sortedIdxs = $computed(() => {
  const columnData = props.tableData.data[sortedHeaderIdx]
  const filteredColumn = searchIdxs.map(dataIdx => columnData[dataIdx])
  const sortFn = getSortMethod(filteredColumn, sortedHeader.type, sortDirection)

  const idxRange = Array.from({ length: searchIdxs.length }, (_, i) => i)
  const idxs = sortedHeader.sortable ? idxRange.sort(sortFn) : idxRange
  return idxs.map(dataIdx => searchIdxs[dataIdx])
})

// ------------------------------------------------
// create sort method based on the header/column type
// ------------------------------------------------
function getSortMethod(col, type, direction) {
  const directionFactor = direction === 1 ? 1 : -1

  switch (type) {
    case 'number':
    case 'date':
      return (a, b) => (col[a] - col[b]) * directionFactor
    case 'string':
      return (a, b) => {
        const valueA = col[a].toLowerCase()
        const valueB = col[b].toLowerCase()
        if (direction === 1) {
          return valueA < valueB ? -1 : valueA > valueB ? 1 : 0
        } else {
          return valueB < valueA ? -1 : valueB > valueA ? 1 : 0
        }
      }
  }
}

// *==================================================*
// *--------- PAGINATION -----------------------------*
// *==================================================*

// ------------------------------------------------
// slice filtered data
// ------------------------------------------------
let selectedRows = $ref(props.rowsPerPage)
let pages = reactive({
  startIdx: 0,
  endIdx: selectedRows
})

const changePage = (newPages) => {
  Object.assign(pages, newPages)
}

// *==================================================*
// *--------- RENDERING ------------------------------*
// *==================================================*
const filteredData = computed(() => {
  const rangeSortedIdxs = sortedIdxs.slice(pages.startIdx, pages.endIdx)
  
  return props.tableData.headers.map((_, colIdx) =>
    rangeSortedIdxs.map(dataIdx => props.tableData.data[colIdx][dataIdx])
  )
})
</script>

<template>
  <Table 
    @onHeaderSort="sort"
    :tableData="filteredData" 
    :headers="tableData.headers" 
    :sortedHeader="sortedHeader"
    :sortDirection="sortDirection" 
    :defaultSortDirection="defaultSortDirection"
    :tableItemsCount="searchIdxs.length"
    :sortedIdxs="sortedIdxs"
    :searchQuery="searchQuery"
    :searchType="searchType"
  />
  <Pagination 
    @onChangePage="changePage" 
    :entries="searchIdxs.length" 
    :rowsPerPage="rowsPerPage" 
  />
</template>
