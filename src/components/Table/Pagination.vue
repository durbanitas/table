<script setup>
import { computed } from 'vue'

const props = defineProps({
  entries: {
    type: Number,
    required: true
  },
  rowsPerPage: {
    type: Number,
    default: 10
  }
})

// custom rows per page
const rowsOptions = $ref([5, 10, 20, 50])
const selectedRowsPerPage = $ref(props.rowsPerPage)
function changeRPP() {
  displayList()
}

const currentPage = $ref(0)
// currentPage in parent?
// TODO: update displayList when rowsPerPage changes
const emit = defineEmits(['onChangePage'])
function displayList(direction) {
  const { entries } = props
  if (direction === 'prev') {
    if (currentPage <= 0) return
    currentPage--
  } else if (direction === 'next') {
    const maxEnd = entries / selectedRowsPerPage
    if (currentPage >= maxEnd - 1) return
    currentPage++
  }
  const startIdx = selectedRowsPerPage * currentPage
  const endIdx = startIdx + selectedRowsPerPage
  emit('onChangePage', { startIdx, endIdx })
}

// template current page
const currentPageView = computed(() => {
  return `${selectedRowsPerPage * (currentPage) + 1} - ${(selectedRowsPerPage * currentPage) + selectedRowsPerPage}`
})
</script>

<template>
  <div class="pagination-wrapper space-between">

    <!-- navigation -->
    <div>
      <span>Rows per page:</span>
      <select v-model.number="selectedRowsPerPage" @change="changeRPP()">
        <option v-for="r in rowsOptions" :key="r.id">
          {{ r }}
        </option>
      </select>
    </div>

    <!-- entries -->
    <div>{{ currentPageView }} of {{ entries }}       
      <span class="icon" @click="displayList('prev')"> &#8249; </span>
      <span class="icon" @click="displayList('next')"> &#8250; </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pagination-wrapper {
  padding: 8px;
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
