<script setup>
import { ref, watch } from 'vue'
import IconBackward from '../../assets/svgs/chevron-backward.svg'
import IconLeft from '../../assets/svgs/chevron-left.svg'
import IconRight from '../../assets/svgs/chevron-right.svg'
import IconForward from '../../assets/svgs/chevron-forward.svg'

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
  const beginStr = (fromEntries + 1).toLocaleString()
  const uptoStr = (fromEntries + selectedRows.value <= props.entries ? uptoEntries : props.entries).toLocaleString()
  return `${beginStr} - ${uptoStr}`
})
</script>

<template>
  <div class="pagination-wrapper space-between">
    <!-- navigation -->
    <div class="inline-center">
      <!-- <span>Rows per page:</span> -->
      <div class="dropdown">
        <select v-model="selectedRows" @change="changePage(currentPage)">
          <option v-for="r in rowsOptions" :key="r.id" :value="r" v-text="r + ' rows'" />
        </select>
      </div>
    </div>
    <!-- entries -->
    <div class="inline-center">
      <span class="mr-6">{{ currentPageView }} <span class="text-muted">of</span> {{ entries.toLocaleString()
      }}</span>
      <span @click="changePage(0)" class="icon-btn align-center" :class="{ 'disabled': currentPage === 0 }">
        <IconBackward class="icon --pagination" />
      </span>
      <span @click="prevPage()" class="icon-btn align-center mr-6" :class="{ 'disabled': currentPage === 0 }">
        <IconLeft class="icon --pagination" />
      </span>
      <span @click="nextPage()" class="icon-btn align-center" :class="{ 'disabled': currentPage === numPages }">
        <IconRight class="icon --pagination" />
      </span>
      <span @click="changePage(numPages)" class="icon-btn align-center"
        :class="{ 'disabled': currentPage === numPages }">
        <IconForward class="icon --pagination" />
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
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

.space-between {
  display: flex;
  justify-content: space-between;
}

.icon-btn {
  padding: 6px;
  background-color: var(--single-pill-bg);
  border: 1px solid var(--btn-border);
  margin: 2px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: var(--btn-bg-hover);

    .--pagination {
      fill: var(--action);
    }
  }

  &.disabled {
    cursor: not-allowed;
    background-color: var(--btn-bg-disabled);

    .--pagination {
      cursor: not-allowed;
      fill: var(--text-disabled);
    }
  }
}
</style>
