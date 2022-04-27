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
function sort (head, colIdx) {
  const { sortedHeader, defaultSortDirection, sortDirection } = props
  const newHeader = head !== sortedHeader
  const newDirection = newHeader ? defaultSortDirection : sortDirection * -1
  emit('onHeaderSort', head, newDirection, colIdx)
}

function transformData (data, type) {
  if (type === 'date') {
    const dateObject = new Date(data)
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const timeOptions = { hour12: false, hour: '2-digit', minute: '2-digit', seconds: '2-digit' };
    return dateObject.toLocaleString('us-US', dateOptions) + ' ' + dateObject.toLocaleTimeString('us-US', timeOptions)
  } else {
    return data
  }
}
</script>

<template>
  <div class="table-wrapper">
    <table>
      <!-- headers -->
      <thead>
        <tr>
          <th v-for="(head, colIdx) in headers" :key="head.id" :class="{ 'cursor-pointer': head.sortable }"
            v-on="head.sortable ? { click: () => sort(head, colIdx) } : {}">
            <div class="space-center table-name">
              <div v-html="head.label" />
              <div class="pl-30" v-if="head.sortable">
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
              <td v-for="(data, colIdx) in tableData" :class="[headers[colIdx].align, { 'parent': colIdx === 0 }]"
                :key="data.id" v-html="transformData(data[rowIdx], headers[colIdx].type)" />
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
  </div>
</template>

<style lang="scss" scoped>
.table-wrapper {
  border: 1px solid var(--table-divider);
  position: relative;
  min-height: 100px;
  max-height: 500px;
  height: auto;
  width: 100%;
  overflow: auto;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

// sortings
.cursor-pointer {
  cursor: pointer;
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
