<script setup>
import { transformData } from './utils';

const props = defineProps({
  tableData: Array,
  sortedHeader: Object,
  headers: Array,
  rowIdx: {
    type: Number,
    default: 0,
  },
  searchQuery: {
    type: String,
    default: '',
  },
  searchType: {
    type: String,
    default: 'string',
  },
});
</script>

<template>
  <tr>
    <td
      v-for="(data, colIdx) in tableData"
      :class="[
        headers[colIdx].align,
        {
          parent: colIdx === 0,
          'text-bold': colIdx === sortedHeader.columnKey,
          'date-between': colIdx === 2,
        },
      ]"
      :key="data.id"
      v-html="transformData(data[rowIdx], headers[colIdx].type, colIdx, searchQuery, searchType)"
    />
  </tr>
</template>

<style lang="scss" scoped>
.text-end {
  text-align: right;
}

.text-center {
  text-align: center;
}

.text-start {
  text-align: left;
}

.date-between {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}
</style>
