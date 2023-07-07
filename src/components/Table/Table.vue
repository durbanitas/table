<script setup>
import { onMounted } from 'vue'
import TableHeader from './TableHeader.vue';
import { transformData } from './utils'

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

// sort events
const emit = defineEmits(['onHeaderSort', 'trimVirtualList'])
function sort({ head, colIdx }) {
  const { sortedHeader, defaultSortDirection, sortDirection } = props
  const newHeader = head !== sortedHeader
  const newDirection = newHeader ? defaultSortDirection : sortDirection * -1
  emit('onHeaderSort', head, newDirection, colIdx)
  virtualScrollRef.scrollTop = 0
}

// VIRTUAL TABLE
const rowHeight = 30;
const nodePadding = 20;
let scrollTop = $ref(0);

// COMPUTED
const itemCount = $computed(() => props.tableItemsCount)
const viewportHeight = $computed(() => itemCount * rowHeight)
const startIndex = $computed(() => {
  let startNode = Math.floor(scrollTop / rowHeight) - nodePadding;
  startNode = Math.max(0, startNode);
  return startNode;
})
const visibleNodeCount = $computed(() => {
  let count = Math.ceil(tableHeight / rowHeight) + 2 * nodePadding;
  count = Math.min(itemCount - startIndex, count);
  return count;
})
const visibleItems = $computed(() => {
  const sortedArray = props.sortedIdxs.map(idx => props.tableData[idx])
  return sortedArray.slice(startIndex, startIndex + visibleNodeCount);
})
const offsetY = $computed(() => {
  return startIndex * rowHeight
})
const spacerStyle = $computed(() => {
  return {
    transform: `translateY(${offsetY}px)`,
  };
})
const viewportStyle = $computed(() => {
  return {
    'min-height': '41px',
    'height': `${viewportHeight}px`,
    position: "relative",
  };
})

const hasData = $computed(() => props.tableData[0].length > 0)
</script>

<template>
  <!-- @scroll="handleScroll" -->
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
            <tr>
              <td 
                v-for="(data, colIdx) in tableData" 
                :class="[
                  headers[colIdx].align, 
                  { 'parent': colIdx === 0 }, 
                  { 'text-bold': colIdx === sortedHeader.columnKey },
                  { 'date-between': colIdx === 2 }
                ]"
                :key="data.id" v-html="transformData(data[rowIdx], headers[colIdx].type, colIdx, searchQuery, searchType)"
              />
            </tr>
          </template>
        </template>

        <template v-else>
          <tr>
            <td :colspan="headers.length + 1" v-text="'No results'" />
          </tr>
        </template>
      </tbody>
    </table>

    <table v-else>
      <thead>
        <tr>
          <th 
            v-for="(head, colIdx) in headers" 
            :key="head.id"
            v-on="head.sortable ? { click: () => sort(head, colIdx) } : {}"
          >
          <!-- FIXME: align header -->
            <div 
              class="align-center table-name"
            >
              <!-- :class="head.align" -->
              <div v-html="head.label" />
              <div class="pl-6" v-if="head.sortable">
                <div class="up-arrow"
                  :class="{ 'active-up': head.columnKey === sortedHeader.columnKey && sortDirection === -1 }" />
                <div class="down-arrow"
                  :class="{ 'active-down': head.columnKey === sortedHeader.columnKey && sortDirection === 1 }" />
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="visibleItems.length">
          <div :style="viewportStyle">
            <div class="spacer" :style="spacerStyle">
              <tr 
                v-for="(item, index) in visibleItems" 
                :key="index" 
                class="list-item"
              >
                <td 
                  v-for="(value, key, index) in item" 
                  class="cell-item"
                  :class="[{ 'first-cell-item': index === 0}, headers[index].align ]"
                  :key="index.id"
                  v-html="value"
                />  
              </tr>
            </div>
          </div>
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

.pl-30 {
  padding-left: 30px;
}

// HELPERS
.end {
  text-align: right;
  justify-content: end;
}

.center {
  text-align: center;
  justify-content: center;
}

.start {
  text-align: left;
  justify-content: start;
}

.date-between {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}


</style>
