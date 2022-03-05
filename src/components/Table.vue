<script setup>
import { computed } from 'vue'

const props = defineProps({
  loading: Boolean,
  // rendered data
  headers: Array,
  tableData: Array,
  // filter table
  filterTags: Array,
  // sort table
  sortedHeader: Object,
  sortDirection: Number,
  defaultSortDirection: {
    type: Number,
    default: 1
  },
  // customize layout
  densePadding: {
    type: Boolean,
    default: false
  }
  // show grid (horizontal, vertical, all, none)
  // swapLayout: String,
  // pagination
  // pagination: ...,
  // interaction
  // scrollSnapToCell: Boolean,
  // customCellWidth: (resizeEvent, px width)
  // themingColors: (primary-color, secondary-color, ...)
  // crossCellHighlighting: Boolean
})

// sort methods
const sortMethod = (type, head, direction) => {
  if (type === 'String') {
    return direction === 1 ?
      (char1, char2) => char2[head].toLowerCase() > char1[head].toLowerCase() ? -1 : char1[head].toLowerCase() > char2[head].toLowerCase() ? 1 : 0 :
      (char1, char2) => char1[head].toLowerCase() > char2[head].toLowerCase() ? -1 : char2[head].toLowerCase() > char1[head].toLowerCase() ? 1 : 0
  } else if (type === 'Number') {
    return direction === 1 ?
      (char1, char2) => char2[head] - char1[head] :
      (char1, char2) => char1[head] - char2[head]
  } else if (type === 'Date') {
    return direction === 1 ?
      (char1, char2) => new Date(char2[head]) - new Date(char1[head]) :
      (char1, char2) => new Date(char1[head]) - new Date(char2[head])
  }
}
// sort events
const emit = defineEmits(['onHeaderSort'])
function sort (headObj) {
  const { sortedHeader, defaultSortDirection, sortDirection } = props
  const newHeader = headObj.key !== sortedHeader.key
  const newDirection = newHeader ? defaultSortDirection : sortDirection * -1
  emit('onHeaderSort', headObj, newDirection)
}
// filtered results
const filteredData = computed(() => {
  const { sortedHeader, sortDirection } = props
  const type = sortedHeader.type
  const head = sortedHeader.key
  const direction = sortDirection
  // return filtered and sorted data
  return props.tableData.filter(el => {
    return el
  }).sort(sortMethod(type, head, direction))
})

// template styles
const tdPadding = computed(() => ({
  'padding-dense': props.densePadding,
  'padding-full': !props.densePadding
}))
</script>

<template>
  <div class="table-container">
    <table>
      <!-- headers -->
      <thead>
        <tr>
          <th
            v-for="(head, idx) in props.headers"
            :key="head.id"
            @click="sort(head)"
          >
            <div class="space-center">
              <div>{{ head.label}}</div>
              <div class="pl-8">
                <div
                  class="up-arrow"
                  :class="{ 'active-up': head.label=== props.sortedHeader.label&& sortDirection === -1 }"
                />
                <div
                  class="down-arrow"
                  :class="{ 'active-down': head.label=== props.sortedHeader.label&& sortDirection === 1 }"
                />
              </div>
            </div>

          </th>
        </tr>
      </thead>
      <!-- BODY -->
      <tbody>
        <!-- LOADING DATA -->
        <template v-if="props.loading">
          <tr>
            <td
              :colspan="props.headers.length"
              :class="tdPadding"
              v-text="'Loading data...'"
            />
          </tr>
        </template>
        <!-- RENDER DATA -->
        <template v-else>

          <template v-if="filteredData.length">
            <tr
              v-for="(data, i) in filteredData"
              :key="data.id"
            >
              <td
                v-for="(head, idx) in headers"
                :class="[
                  tdPadding, 
                  { 'text-right': head.type === 'Number' }
                ]"
              >
                <span>
                  {{ data[head.key] }}
                </span>
              </td>
            </tr>
          </template>
          <!-- handle no results -->
          <template v-else>
            <tr>
              <td
                :colspan="props.headers.length"
                v-text="'No results'"
              />
            </tr>
          </template>

        </template>
      </tbody>
    </table>
  </div>

  <!-- footer -->
  <div class="space-between">
    <div>
      {{ filteredData.length }} of {{ props.tableData.length }} entries</div>
    <div>
      Pagination
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-container {
  position: relative;
  max-height: 400px;
  width: 100%;
  overflow: auto;
}

table {
  border-collapse: collapse; // removes border-spacing
  font-family: helvetica;
  // cell settings & sizes
  td,
  th {
    border: 0;
    // padding: 10px;
    min-width: auto;
    box-sizing: border-box;
    text-align: left;
  }
  // custom headers
  thead th {
    position: sticky;
    top: 0;
    z-index: 2;
    background: #ffbf9f;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    padding: 8px;
    &:first-child {
      left: 0;
      z-index: 3;
    }
  }
  // border settings & sizes
  tbody {
    overflow: scroll;
    height: 200px;
    text-transform: capitalize;
    // sticky left row
    tr > :first-child {
      position: sticky;
      background: #c2c2c2;
      left: 0;
      max-width: 150px;
      min-width: 100px;
    }
    & tr:nth-child(odd) {
      background: #ddd;
    }
    & tr:hover {
      background: yellow;
    }
  }
}

// sortings
.up-arrow {
  width: 0;
  height: 0;
  border: solid 5px transparent;
  background: transparent;
  border-bottom: solid 7px #999;
  border-top-width: 0;
  cursor: pointer;
}
.down-arrow {
  width: 0;
  height: 0;
  border: solid 5px transparent;
  background: transparent;
  border-top: solid 7px #999;
  border-bottom-width: 0;
  margin-top: 2px;
  cursor: pointer;
}
.active-up {
  border-bottom: solid 7px red;
}
.active-down {
  border-top: solid 7px red;
}

// ADAPTIVE STYLES
.padding-dense {
  padding: 2px 10px 2px 10px;
}
.padding-full {
  padding: 10px;
}

// HELPERS
.text-right {
  text-align: right;
}
.space-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.space-between {
  display: flex;
  justify-content: space-between;
}
.pl-8 {
  padding-left: 8px;
}
</style>
