<script setup>
import { computed } from 'vue'

const props = defineProps({
  loading: Boolean,
  // rendered data
  headers: Array,
  tableData: Array,
  // filter table
  fiterTags: Array,
  // sort table
  sortedHeader: Object,
  sortDirection: Number,
  defaultSortDirection: {
    type: Number,
    default: 1
  },
  // customize layout
  // swapLayout: String,
  // densePadding: Boolean,
  // Pagination: null,
  // scrollSnapToCell: Boolean,
  // customCellWidth: null
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
  const direction = newHeader ? defaultSortDirection : sortDirection * -1
  emit('onHeaderSort', headObj, direction)
}
// filtered results
const filteredData = computed(() => {
  const type = props.sortedHeader.type
  const head = props.sortedHeader.key
  const direction = props.sortDirection
  // return filtered and sorted data
  return props.tableData.filter(el => {
    return el
  }).sort(sortMethod(type, head, direction))
})
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
              <div class="pl-6">
                <div
                  class="up-arrow"
                  :class="{ 'active-up': head.label=== props.sortedHeader.label&& sortDirection === 1 }"
                />
                <div
                  class="down-arrow"
                  :class="{ 'active-down': head.label=== props.sortedHeader.label&& sortDirection === -1 }"
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
              v-text="'Loading data...'"
            />
          </tr>
        </template>
        <!-- RENDER DATA -->
        <template v-else>

          <template v-if="filteredData.length">
            <tr
              v-for="(n, i) in filteredData"
              :key="n.id"
            >
              <td v-for="(head, idx) in headers">
                <span>
                  {{ n[head.key] }}
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
</template>


<style lang="scss" scoped>
// TODO: cross cell highlighting row & column & cell
// - use mouseover events & JS
// custom cell width
.space-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
thead {
  user-select: none;
  cursor: pointer;
}
.table-container {
  position: relative;
  max-height: 400px;
  width: 100%;
  overflow: scroll;
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
  margin-top: 1px;
  cursor: pointer;
}
.active-up {
  border-bottom: solid 7px red;
}
.active-down {
  border-top: solid 7px red;
}
</style>
