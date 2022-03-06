<script setup>
import Table from './Table.vue'
import { computed } from 'vue'

const props = defineProps({
  tableData: {
    type: Array,
    required: true,
    validator: arr => validationMessage('Array', arr, 'tableData')
  },
  headers: {
    type: Array,
    required: true,
    validator: arr => validationMessage('Array', arr, 'headers')
  },
  // optional
  defaultSortDirection: {
    type: Number,
    default: 1,
    validator: num => validationMessage('Index', num, 'defaultSortDirection')
  },
  defaultSortByHeader: {
    type: Number,
    default: 1,
    // validator: num => validationMessage('Range', num, 'defaultSortByHeader')
    // Use type: String? like 'name'?
  },
  sortingLowerUpperCase: {
    type: Boolean,
    default: true,
    validator: val => validationMessage('Boolean', val, 'sortingLowerUpperCase')
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
const sortMethod = (type, head, direction) => {
  switch (type) {
    case 'String':
      return props.sortingLowerUpperCase ? 
        direction === 1 ?
          (char1, char2) => char2[head].toLowerCase() > char1[head].toLowerCase() ? -1 : char1[head].toLowerCase() > char2[head].toLowerCase() ? 1 : 0 :
          (char1, char2) => char1[head].toLowerCase() > char2[head].toLowerCase() ? -1 : char2[head].toLowerCase() > char1[head].toLowerCase() ? 1 : 0 :
        direction === 1 ?
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

// RENDERED DATA
const filteredData = computed(() => {
  const type = sortedHeader.type
  const head = sortedHeader.key
  // return filtered and sorted data
  return props.tableData.sort(sortMethod(type, head, sortDirection))
})
</script>

<script>
// property validation messages
function validationMessage (type, value, prop) {
  console.log(type);
  switch (type) {
    case 'Array': {
      if (!value.length) {
        console.error('Please provide a length for: ' + prop)
        return false
      } else {
        return true
      }
    }
    case 'Index': {
      if (value !== 1 && value !== -1) {
        console.error('Wrong index value for: ' + prop)
        return false
      } else {
        return true
      }
    }
    // case 'Range': {
    //  // reference props.headers.length
    // }
    // FIXME: unreachable if value !== Boolean?
    case 'Boolean': {
      console.log(typeof value !== 'boolean');
      if (typeof value !== 'boolean') {
        console.error(prop + ' must be a boolean')
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<template>
  <!-- Filtering.vue  -->
  <Table
    :headers="headers"
    :tableData="filteredData"
    :sortDirection="sortDirection"
    :sortedHeader="sortedHeader"
    @onHeaderSort="sort"
  />
  <!-- Pagination.vue -->
</template>
