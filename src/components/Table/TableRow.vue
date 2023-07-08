<script setup>
import { transformData } from './utils'

const props = defineProps({
  tableData: Array,
  sortedHeader: Object,
  headers: Array,
  rowIdx: Number,
  searchQuery: String,
  searchType: {
    type: String,
    default: 'string'
  },
})
</script>

<template>
  <tr>
    <td 
      v-for="(data, colIdx) in tableData" 
      :class="[
        headers[colIdx].align, 
        { 'parent': colIdx === 0 }, 
        { 'text-bold': colIdx === sortedHeader.columnKey },
        { 'date-between': colIdx === 2 }
      ]"
      :key="data.id" 
      v-html="transformData(data[rowIdx], headers[colIdx].type, colIdx, searchQuery, searchType)"
    />
  </tr>
</template>

<style lang="scss" scoped>
.end {
  text-align: right;
}

.center {
  text-align: center;
}

.start {
  text-align: left;
}

.date-between {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}
</style>