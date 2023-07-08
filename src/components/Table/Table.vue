<script setup>
import { onMounted } from 'vue'
import TableHeader from './TableHeader.vue';
import TableRow from './TableRow.vue';

const props = defineProps({
  headers: {
    type: Array,
    required: true
  },
  tableData: {
    type: Array,
    required: true
  },
  // sort table
  sortedHeader: {
    type: Object,
    required: true
  },
  sortDirection: {
    type: Number,
    required: true
  },
  defaultSortDirection: {
    type: Number,
    default: 1
  },
  listType: {
    type: String,
    default: 'pagination',
    required: true
  },
  tableItemsCount: {
    type: Number,
    default: 100,
    required: true
  },
  sortedIdxs: {
    type: Array,
    required: true
  },
  searchQuery: {
    type: String,
    default: ''
  },
  searchType: {
    type: String,
    default: 'string'
  },
})

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
});

const virtualScrollRef = $ref(null)

let innerHeight = $ref(0)
const handleResize = () => {
  innerHeight = window.innerHeight
}
const navH = 40
const filterH = 60
const bottomH = 100
const tableHeight = $computed(() => {
  const deg = navH + filterH + bottomH
  return props.listType === 'pagination' ? innerHeight - deg : innerHeight - (deg - 61)
})

// *==================================================*
// *--------- SORT EVENTS ----------------------------*
// *==================================================*
const emit = defineEmits(['onHeaderSort'])
function sort({ head, colIdx }) {
  const { sortedHeader, defaultSortDirection, sortDirection } = props
  const newHeader = head !== sortedHeader
  const newDirection = newHeader ? defaultSortDirection : sortDirection * -1
  emit('onHeaderSort', head, newDirection, colIdx)
  virtualScrollRef.scrollTop = 0
}

// *==================================================*
// *--------- HANDLE RESULTS -------------------------*
// *==================================================*
const hasData = $computed(() => props.tableData[0].length > 0)
</script>

<template>
  <div 
    class="table-wrapper" 
    :style="{ 'max-height': tableHeight + 'px' }" 
    ref="virtualScrollRef"
  >
    <table v-if="listType === 'pagination'">

      <TableHeader 
        @sort="sort" 
        :headers="headers" 
        :sortedHeader="sortedHeader" 
        :sortDirection="sortDirection" 
      />

      <tbody>
        <template v-if="hasData">
          <template v-for="(_, rowIdx) in tableData[0].length">

            <TableRow
              :tableData="tableData"
              :sortedHeader="sortedHeader"
              :headers="headers"
              :rowIdx="rowIdx"
              :searchQuery="searchQuery"
              :searchType="searchType"
            />

          </template>
        </template>

        <template v-else>
          <tr>
            <td :colspan="headers.length + 1" v-text="'No results'" />
          </tr>
        </template>
      </tbody>
    </table>

  </div>
</template>

<style lang="scss" scoped>
.table-wrapper {
  background-color: var(--table-cell-bg);
  position: relative;
  height: auto;
  width: 100%;
  overflow: auto;
}
</style>
