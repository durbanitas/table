<script setup>
import { ref, watch } from 'vue'

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
const selectedRows = ref(props.rowsPerPage)

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
  if (page < 1) { // validate page
    currentPage = 0
  } else if (page >= numPages) {
    currentPage = numPages
  }
  const startIdx = selectedRows.value * currentPage
  const endIdx = startIdx + selectedRows.value
  emit('onChangePage', { startIdx, endIdx })
}

watch(selectedRows, () => changePage(currentPage))
watch(() => props.entries, () => changePage(0))

// all possible n pages
const numPages = $computed(() => Math.ceil(props.entries / selectedRows.value) - 1)
// template current pages
const currentPageView = $computed(() => {
  const fromEntries = selectedRows.value * currentPage
  const uptoEntries = fromEntries + selectedRows.value
  const uptoStr = fromEntries + selectedRows.value <= props.entries ? uptoEntries : props.entries

  return `${fromEntries + 1} - ${uptoStr}`
})
</script>

<template>
  <div class="pagination-wrapper space-between">
    <!-- navigation -->
    <div>
      <span>Rows per page:</span>
      <select v-model.number="selectedRows" @change="changePage(currentPage)">
        <option v-for="r in rowsOptions" :key="r.id">
          {{ r }}
        </option>
      </select>
    </div>
    <!-- entries -->
    <div>{{ currentPageView }} of {{ entries }}
      <span class="icon" @click="changePage(0)" :class="{ 'disabled': currentPage === 0 }"> |&#8249; </span>
      <span class="icon" @click="prevPage()" :class="{ 'disabled': currentPage === 0 }"> &#8249; </span>
      <span class="icon" @click="nextPage()" :class="{ 'disabled': currentPage === numPages }"> &#8250; </span>
      <span class="icon" @click="changePage(numPages)" :class="{ 'disabled': currentPage === numPages }"> &#8250;|
      </span>
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
