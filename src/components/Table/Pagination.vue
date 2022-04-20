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
const currentPage = $ref(0)
const rowsOptions = $ref([5, 10, 20, 50])
const selectedRowsPerPage = $ref(props.rowsPerPage)

function prevPage () {
  if (currentPage > 0) {
    currentPage--
    changePage(currentPage)
  }
}
function nextPage () {
  if (currentPage < numPages) {
    currentPage++
    changePage(currentPage)
  }
}
const emit = defineEmits(['onChangePage'])
function changePage (page) {
  // validate page
  if (page < 1) {
    currentPage = 0
  } else if (page >= numPages) {
    currentPage = numPages
  }
  const startIdx = selectedRowsPerPage * currentPage
  const endIdx = startIdx + selectedRowsPerPage
  emit('onChangePage', { startIdx, endIdx })
}
// all possible n pages
const numPages = $computed(() => Math.ceil(props.entries / selectedRowsPerPage) - 1)
// template current pages
const currentPageView = $computed(() => {
  const fromEntries = selectedRowsPerPage * currentPage
  const uptoEntries = fromEntries + selectedRowsPerPage

  return `${fromEntries + 1} - ${fromEntries + selectedRowsPerPage <= props.entries ? uptoEntries : props.entries}`
})
</script>

<template>
  <div class="pagination-wrapper space-between">
    <!-- navigation -->
    <div>
      <span>Rows per page:</span>
      <select v-model.number="selectedRowsPerPage" @change="changePage(currentPage)">
        <option v-for="r in rowsOptions" :key="r.id">
          {{ r }}
        </option>
      </select>
    </div>
    <!-- entries -->
    <div>{{ currentPageView }} of {{ entries }}
      <span class="icon" @click="prevPage()" :class="{ 'disabled': currentPage === 0 }"> &#8249; </span>
      <span class="icon" @click="nextPage()" :class="{ 'disabled': currentPage === numPages }"> &#8250; </span>
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

.disabled {
  cursor: not-allowed;
  color: grey;

  &:hover {
    color: grey;
  }
}
</style>
