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
  },
  sortedIdxs: {
    type: Array,
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
  return props.listType === 'pagination' ? innerHeight - deg : innerHeight - (deg - 61)
})

// sort events
const emit = defineEmits(['onHeaderSort', 'trimVirtualList'])
function sort (head, colIdx) {
  const { sortedHeader, defaultSortDirection, sortDirection } = props
  const newHeader = head !== sortedHeader
  const newDirection = newHeader ? defaultSortDirection : sortDirection * -1
  emit('onHeaderSort', head, newDirection, colIdx)
}

const maxZeros = 4
const transformNum = (num) => {
  const str = num.toString()
  const x = str.split('.')
  let htmlStr
  if (x.length === 1) {
    htmlStr = x[0] + '<span class="text-muted">.0000</span>'
  } else {
    const floatLen = x[1].length
    const zeroNums = maxZeros - floatLen
    const zeros = '0'.repeat(zeroNums)
    htmlStr = x[0] + `.${x[1]}<span class="text-muted">${zeros}</span>`
  }
  return htmlStr
}
const transformNumColored = (num) => { 
  const isPos = num > 0
  const str = num.toString()
  const x = str.split('.')
  let htmlStr
  
  if (isPos) {
    if (x.length === 1) {
      htmlStr = `<span class="text-positive">${x[0]}</span><span class="text-muted-positive">.0000</span>`
    } else {
      const floatLen = x[1].length
      const zeroNums = 4 - floatLen
      const zeros = '0'.repeat(zeroNums)
      htmlStr = `<span class="text-positive">${x[0]}.${x[1]}</span><span class="text-muted-positive">${zeros}</span>`
    }
  } else {
    if (x.length === 1) {
      htmlStr = `<span class="text-negative">${x[0]}</span><span class="text-muted-negative">.0000</span>`
    } else {
      const floatLen = x[1].length
      const zeroNums = 4 - floatLen
      const zeros = '0'.repeat(zeroNums)
      htmlStr = `<span class="text-negative">${x[0]}.${x[1]}</span><span class="text-muted-negative">${zeros}</span>`
    }
  }
  return htmlStr
}

const transformData = (data, type, index) => {
  if (type === 'date') {
    const dateObject = new Date(data)
    const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    const timeOptions = { hour12: true, hour: 'numeric', minute: '2-digit', seconds: '2-digit' };
    const dateDay = dateObject.toLocaleDateString('en-US', dateOptions)
    const dateHour = dateObject.toLocaleTimeString('en-US', timeOptions)

    return `${dateDay} <span class="text-muted">${dateHour}</span>`
  } else if (index === 0) {
    return new Intl.NumberFormat('en-US').format(data)
  } else if (index === 3) {
    return `${transformNumColored(data)}`
  } else if (type === 'number') {
    return `${transformNum(data)}`
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
            <div 
              class="align-center table-name"
              :class="head.align"
            >
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
        <template v-if="tableData[0].length">
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
                :key="data.id" v-html="transformData(data[rowIdx], headers[colIdx].type, colIdx)"
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
      :sortedIdxs="sortedIdxs"
    />

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

.text-bold {
  font-weight: 700;
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
