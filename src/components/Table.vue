<script setup>
import { defineProps, defineEmits, computed, ref } from 'vue'
// TODO: add a loading state or placeholder data

const props = defineProps({
  headers: Array,
  tableData: Array,
  fiterTags: Array,
  sortedHeader: Object,
  sortedDirection: Number
})

// sort methods
const sortMethod = {
  'String': props.sortedDirection === 1 ?
    (char1, char2) => char2[props.sortedHeader.value].toLowerCase() > char1[props.sortedHeader.value].toLowerCase() ? -1 : char1[props.sortedHeader.value].toLowerCase() > char2[props.sortedHeader.value].toLowerCase() ? 1 : 0 :
    (char1, char2) => char1[props.sortedHeader.value].toLowerCase() > char2[props.sortedHeader.value].toLowerCase() ? -1 : char2[props.sortedHeader.value].toLowerCase() > char1[props.sortedHeader.value].toLowerCase() ? 1 : 0,
  'Number': props.sortedDirection === 1 ?
    (char1, char2) => char2[props.sortedHeader.value] - char1[props.sortedHeader.value] :
    (char1, char2) => char1[props.sortedHeader.value] - char2[props.sortedHeader.value],
  "Date": props.sortedDirection === 1 ?
    (char1, char2) => new Date(char2[props.sortedHeader.value]) - new Date(char1[props.sortedHeader.value]) :
    (char1, char2) => new Date(char1[props.sortedHeader.value]) - new Date(char2[props.sortedHeader.value])
}
// sort events
const emit = defineEmits(['onHeaderSort'])
function sort (head) {
  emit('onHeaderSort', head)
}
// filtered results
const filteredTable = computed(() => {
  return props.tableData.filter(el => {
    return el
  }).sort(sortMethod[props.sortedHeader.type])
})
</script>

<template>
  <div class="table-container">
    <div v-if="!tableData.length">
      loading ...
    </div>
    <table v-else>
      <!-- headers -->
      <thead>
        <tr>
          <th
            v-for="(head, idx) in props.headers"
            :key="head.id"
            @click="sort(head)"
          >
            {{ head.name }}
          </th>
        </tr>
      </thead>
      <!-- BODY -->
      <tbody>
        <template v-if="filteredTable.length">
          <tr
            v-for="(n, i) in filteredTable"
            :key="n.id"
          >
            <td v-for="(head, idx) in headers">
              <span>
                {{ n[head.value] }}
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

      </tbody>
    </table>
  </div>
</template>


<style lang="scss" scoped>
// TODO: cross cell highlighting row & column & cell
// - use mouseover events & JS
// custom cell width
.table-container {
  position: relative;
  max-height: 400px;
  width: 100%;
  overflow: scroll;
}

table {
  border-collapse: collapse; // removes border-spacing
  font-family: helvetica;
  // cell settings & sizes
  td,
  th {
    border: 0;
    padding: 10px;
    min-width: auto;
    // background: #fff;
    box-sizing: border-box;
    text-align: left;
  }
  // custom headers
  thead th {
    position: sticky;
    top: 0;
    z-index: 2;
    background: #ffbf9f;
    cursor: pointer;
    user-select: none;
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
    }
    & tr:nth-child(odd) {
      background: #ddd;
    }
    & tr:hover {
      background: yellow;
    }
  }
}
</style>
