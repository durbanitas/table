<script setup>
import { ref, watch } from 'vue'
import IconBackward from '../../assets/svgs/chevron-backward.svg'
import IconLeft from '../../assets/svgs/chevron-left.svg'
import IconRight from '../../assets/svgs/chevron-right.svg'
import IconForward from '../../assets/svgs/chevron-forward.svg'
// import IconDropdown from '../../assets/svgs/double-carets.svg'

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
let currentPage = $ref(0)
let rowsOptions = $ref([5, 10, 20, 50])
let selectedRows = ref(props.rowsPerPage)

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
    <div class="inline-center">
      <span>Rows per page:</span>
      <div class="dropdown">
        <select v-model.number="selectedRows" @change="changePage(currentPage)">
          <option v-for="r in rowsOptions" :key="r.id">
            {{ r }}
          </option>
        </select>
        <!-- <IconDropdown class="icon fa" /> -->
      </div>
    </div>
    <!-- entries -->
    <div class="inline-center">
      <span class="mr-6">{{ currentPageView }} of {{ entries }}</span>
      <span @click="changePage(0)">
        <IconBackward class="icon --pagination" :class="{ 'disabled': currentPage === 0 }" />
      </span>
      <span @click="prevPage()">
        <IconLeft class="icon --pagination" :class="{ 'disabled': currentPage === 0 }" />
      </span>
      <span @click="nextPage()">
        <IconRight class="icon --pagination" :class="{ 'disabled': currentPage === numPages }" />
      </span>
      <span @click="changePage(numPages)">
        <IconForward class="icon --pagination" :class="{ 'disabled': currentPage === numPages }" />
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pagination-wrapper {
  padding: 8px;
  margin-right: -2px;
  border-left: 1px solid var(--table-divider);
  border-right: 1px solid var(--table-divider);
  border-bottom: 1px solid var(--table-divider);
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
}

.space-between {
  display: flex;
  justify-content: space-between;
}
</style>
