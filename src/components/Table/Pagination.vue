<script setup>
import { computed } from 'vue'

const props = defineProps({
  entries: {
    type: Number,
    required: true
  },
  rowsPerPage: {
    type: Array,
    default: [1, 5, 10, 25]
  },
  selectedRow: {
    type: Number,
    default: 5
  }
  // currentPage: Number,
})

const selectedRows = $ref(props.selectedRow)
const currentPage = $ref(1)

const emit = defineEmits(['onRowsPerPage', 'onChangePage'])
function changeRows() {
  emit('onRowsPerPage', selectedRows)
}

// currentPage in parent?
// TODO: update displayList when selectedRows changes
function displayList(direction) {
  if (direction === 'prev') {
    if (currentPage <= 0) return
    currentPage--
  } else if (direction === 'next') {
    const maxEnd = props.entries / selectedRows
    if (currentPage >= maxEnd - 1) return
    currentPage++
  }
  const start = selectedRows * currentPage
  const end = start + selectedRows
  emit('onChangePage', { start, end })
}

// template
const currentPageView = computed(() => {
  return `${selectedRows * currentPage + 1}-${(selectedRows * currentPage) + selectedRows}`
})
</script>

<template>
  <div class="pagination-wrapper space-between">
    <div>{{ currentPageView }} of {{ entries }} entries</div>
    <!-- rows per page -->
    <div>
      <label 
        for="rows-per-page" 
        v-text="'Rows per page: '" 
      />
      <select 
        name="rows-per-page" 
        v-model="selectedRows" 
        @change="changeRows"
      >
        <option 
          v-for="n in props.rowsPerPage" 
          :key="n.id" 
          :value="n"
          >
          {{ n }}
        </option>
      </select>
      <!-- navigation -->
      <!-- ASK: show current page indicator? -->
      <!-- <span class="icon"> &#171; </span> -->
      <span class="icon" @click="displayList('prev')"> &#8249; </span>
      <span class="icon" @click="displayList('next')"> &#8250; </span>
      <!-- <span class="icon"> &#187; </span> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pagination-wrapper {
  padding: 8px 0 8px 0;
  border: 1px solid #ccc;
}
.space-between {
  display: flex;
  justify-content: space-between;
}
.icon {
  padding-left: 4px;
  padding-right: 4px;
  font-size: 1.15rem;
  cursor: pointer;
  user-select: none;
  &:hover {
    color: red;
  }
}
</style>
