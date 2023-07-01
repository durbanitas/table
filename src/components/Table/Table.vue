<script setup>
import { onMounted } from 'vue'
import VirtualTable from './VirtualTable.vue';

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
  }
})

// TODO: filters:
// - remove normal pills
// - add badge counter
// - icons for button group pagination / virtual list

// TODO: table:
// table height from client height
// better spacing
// style headers
// add sorting
// virtual list bottom -> show current visible results

// v2: add search bar


onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
});

let innerHeight = $ref(0)
const handleResize = () => {
  innerHeight = window.innerHeight
}
const navH = 40
const filterH = 60
const bottomH = 100
const tableHeight = $computed(() => {
  const deg = navH + filterH + bottomH
  return innerHeight - deg
})

// sort events
const emit = defineEmits(['onHeaderSort', 'trimVirtualList'])
function sort (head, colIdx) {
  const { sortedHeader, defaultSortDirection, sortDirection } = props
  const newHeader = head !== sortedHeader
  const newDirection = newHeader ? defaultSortDirection : sortDirection * -1
  emit('onHeaderSort', head, newDirection, colIdx)
}

function transformData(data, type) {
  console.log({data, type});
  if (type === 'date') {
    const dateObject = new Date(data)
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const timeOptions = { hour12: false, hour: '2-digit', minute: '2-digit', seconds: '2-digit' };
    const dateDay = dateObject.toLocaleString('us-US', dateOptions)
    const dateHour = dateObject.toLocaleTimeString('us-US', timeOptions)
    return dateDay + ' ' + dateHour
  } else {
    return data
  }
}
</script>

<template>
  <div class="table-wrapper" :style="{ 'max-height': tableHeight + 'px' }">
    <table v-if="listType === 'pagination'">
      <!-- headers -->
      <thead>
        <tr>
          <th 
            v-for="(head, colIdx) in headers" 
            :key="head.id"
            v-on="head.sortable ? { click: () => sort(head, colIdx) } : {}"
          >
            <div class="align-center table-name">
              <div />
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
      <!-- BODY -->
      <tbody>
        <!-- FIXME: get longest name and adapt cell width -->
        <template v-if="tableData[0].length">
          <template v-for="(_, rowIdx) in tableData[0].length">
            <tr>
              <td 
                v-for="(data, colIdx) in tableData" 
                :class="[headers[colIdx].align, { 'parent': colIdx === 0 }]"
                :key="data.id" v-html="transformData(data[rowIdx], headers[colIdx].type)"
              />
            </tr>
          </template>
        </template>
        <!-- handle no results -->
        <template v-else>
          <tr>
            <td :colspan="headers.length + 1" v-text="'No results'" />
          </tr>
        </template>
      </tbody>
    </table>

    <VirtualTable
      v-else
      @sort="sort"
      :headers="headers"
      :tableData="tableData"
      :tableItemsCount="tableItemsCount"
      :sortedHeader="sortedHeader"
      :sortDirection="sortDirection"
      :tableHeight="tableHeight"
    />

  </div>
</template>

<style lang="scss" scoped>
.table-wrapper {
  border: 1px solid var(--table-divider);
  background-color: var(--table-cell-bg);
  position: relative;
  height: auto;
  width: 100%;
  overflow: auto;
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
}

.pl-30 {
  padding-left: 30px;
}

.up-arrow {
  width: 0;
  height: 0;
  border: solid 5px transparent;
  background: transparent;
  border-bottom: solid 7px var(--disabled);
  border-top-width: 0;
  cursor: pointer;
}

.down-arrow {
  width: 0;
  height: 0;
  border: solid 5px transparent;
  background: transparent;
  border-top: solid 7px var(--disabled);
  border-bottom-width: 0;
  margin-top: 2px;
  cursor: pointer;
}

.active-up {
  border-bottom: solid 7px var(--action);
}

.active-down {
  border-top: solid 7px var(--action);
}

// HELPERS
.end {
  text-align: right;
}

.center {
  text-align: center;
}

.start {
  text-align: left;
}
</style>
