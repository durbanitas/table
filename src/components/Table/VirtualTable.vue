<script setup>
import { onBeforeUnmount } from 'vue';
import { transformData } from './utils'
import tableItems from '../../static/jsonObj.json'

const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  tableData: {
    type: Array,
    required: true
  },
  tableItemsCount: {
    type: Number,
    required: true,
    default: 100
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
  tableHeight: {
    type: Number,
    required: true
  },
  sortedIdxs: {
    type: Array,
    required: true
  }
})

const rootHeight = props.tableHeight;
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
  let count = Math.ceil(rootHeight / rowHeight) + 2 * nodePadding;
  count = Math.min(itemCount - startIndex, count);
  return count;
})
const visibleItems = $computed(() => {
  const sortedArray = props.sortedIdxs.map(idx => tableItems[idx])
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

const handleScroll = (event) => {
  scrollTop = event.target.scrollTop;
}

onBeforeUnmount(() => {
  removeEventListener('scroll', handleScroll)
})

// TABLE INTERACTION
const virtualScrollRef = $ref(null)
const emit = defineEmits(['sort'])
const sort = (head, colIdx) => {
  emit('sort', head, colIdx)
  virtualScrollRef.scrollTop = 0
}
</script>

<template>
  <div 
    class="virtual-scroll" 
    @scroll="handleScroll"
    ref="virtualScrollRef"
    :style="{ 'height': tableHeight + 'px' }"
  >
    <div class="sticky-header">
      <div
        v-for="(head, colIdx) in headers" 
        :key="head.id"
        v-on="head.sortable ? { click: () => sort(head, colIdx) } : {}"
        class="header-item"
        :class="{ 'first-header-item': colIdx === 0 }"
        >
        <!-- :style="{ 'width': `${head.charLen * 10}px` }" -->
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
      </div>
    </div>
    
    <template v-if="visibleItems.length">
    <div :style="viewportStyle">
      <div class="spacer" :style="spacerStyle">
          <div 
            v-for="(item, index) in visibleItems" 
            :key="index" 
            class="list-item"
          >
            
            <div 
              v-for="(value, key, index) in item" 
              class="cell-item"
              :class="[{ 'first-cell-item': index === 0}, headers[index].align ]"
              :key="index.id"
              v-html="transformData(value, headers[index].type, index)"
              />
              <!-- :style="{ 'width': `${headers[index].charLen * 10}px` }" -->
  
          </div>
        </div>
      </div>
    </template>

    <div v-else class="no-results" v-text="'No results'">

    </div>
  </div>
</template>

<style lang="scss">
.virtual-scroll {
  overflow-y: scroll;
  overflow-x: scroll;
}

.sticky-header {
  position: sticky;
  z-index: 2;
  top: 0;
  display: flex;
  height: 40px;
  background-color: var(--table-header-bg);
  color: var(--table-header);
  white-space: nowrap;
  user-select: none;
  font-weight: 700;
  width: fit-content;
  border-bottom: 1px solid var(--table-divider);

  .header-item {
    display: flex;
    align-items: center;
    padding: 0 12px;
    &:hover {
      cursor: pointer;
      background-color: var(--table-first-cell-hover);
    }
  }
  .first-header-item {
    position: sticky;
    left: 0;
    z-index: 3;
    background-color: var(--table-header-bg);
    min-width: 60px;
    justify-content: center;
    border-right: 1px solid var(--table-divider);
  }
}

.spacer {
  transform: translateY(0);
  width: fit-content;
}

.list-item {
  height: 40px;
  text-align: left;
  border-bottom: 1px solid var(--table-divider);
  
  .cell-item {
    display: flex;
    align-items: center;
    padding: 0 12px;
  }
  .first-cell-item {
    min-width: 60px;
    position: sticky;
    left: 0;
    z-index: 3;
    background-color: var(--table-header-bg);
    font-weight: 700;
    padding: 0 12px;
  }

  display: flex;
}

.end {
  justify-content: end;
}

.center {
  justify-content: center;
}

.start {
  justify-content: start;
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

.no-results {
  width: fit-content;
  height: calc(100% - 40px);
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 200px;
}

.active-up {
  border-bottom: solid 7px var(--action);
}

.active-down {
  border-top: solid 7px var(--action);
}
</style>