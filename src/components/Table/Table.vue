<script setup>
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
  }
})

// sort events
const emit = defineEmits(['onHeaderSort'])
function sort (headObj) {
  const { sortedHeader, defaultSortDirection, sortDirection } = props
  const newHeader = headObj.key !== sortedHeader.key
  const newDirection = newHeader ? defaultSortDirection : sortDirection * -1
  emit('onHeaderSort', headObj, newDirection)
}

// json scheme
</script>

<template>
  <div class="table-wrapper">
    <table>
      <!-- headers -->
      <thead>
        <tr>
          <th
            v-for="(head, idx) in headers"
            :key="head.id"
            :class="{ 'cursor-pointer': head.sortable  }"
            v-on="head.sortable ? { click: () => sort(head) } : {}"
          >
            <div class="space-center">
              <div>{{ head.label}}</div>
              <div class="pl-8" v-if="head.sortable">
                <div
                  class="up-arrow"
                  :class="{ 'active-up': head.label=== sortedHeader.label&& sortDirection === -1 }"
                />
                <div
                  class="down-arrow"
                  :class="{ 'active-down': head.label=== sortedHeader.label&& sortDirection === 1 }"
                />
              </div>
            </div>

          </th>
        </tr>
      </thead>
      <!-- BODY -->
      <tbody>
          <template v-if="tableData.length">
            <tr
              v-for="(data, i) in tableData"
              :key="data.id"
            >
              <td
                v-for="(head, idx) in headers"
                :class="[
                  { 'text-right': head.type === 'Number' }
                ]"
              >
                <span v-if="head.format">
                  {{ head.format(data[head.key]) }}
                </span>
                <span v-else>
                  {{ data[head.key] }}
                </span>
              </td>
            </tr>
          </template>
          <!-- handle no results -->
          <template v-else>
            <tr>
              <td
                :colspan="headers.length"
                v-text="'No results'"
              />
            </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.table-wrapper {
  position: relative;
  height: 300px;
  width: 100%;
  overflow: auto;
}

table {
  border-collapse: collapse; // removes border-spacing
  font-family: helvetica;
  width: 100%;
  // cell settings & sizes
  td,
  th {
    border: 0;
    padding: 8px;
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
    user-select: none;
    &:first-child {
      left: 0;
      z-index: 3;
    }
  }
  // border settings & sizes
  tbody {
    overflow: scroll;
    // height: 200px;
    text-transform: capitalize;
    white-space: nowrap;
    // sticky left row
    tr > :first-child {
      position: sticky;
      background: #ccc;
      left: 0;
      min-width: 100px;
    }
    & tr:nth-child(odd) {
      background: #ddd;
    }
    & tr:hover {
      background: yellow;
      & :first-child {
        background: yellow;
      }
    }
  }
}

// sortings
.cursor-pointer {
  cursor: pointer;
}
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
