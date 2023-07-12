<script setup>
import { ref, watch } from 'vue';
import IconBackward from '../../assets/svgs/chevron-backward.svg';
import IconLeft from '../../assets/svgs/chevron-left.svg';
import IconRight from '../../assets/svgs/chevron-right.svg';
import IconForward from '../../assets/svgs/chevron-forward.svg';

const props = defineProps({
  entries: {
    type: Number,
    required: true,
  },
  rowsPerPage: {
    type: Number,
    default: 10,
  },
});

// ------------------------------------------------
// custom rows per page
// ------------------------------------------------
let currentPage = $ref(0);
let rowsOptions = $ref([5, 10, 20, 50]);
let selectedRows = ref(props.rowsPerPage);

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    changePage(currentPage);
  }
}
function nextPage() {
  if (currentPage < numPages) {
    currentPage++;
    changePage(currentPage);
  }
}

// ------------------------------------------------
// emit page change to TableParent.vue
// ------------------------------------------------
const emit = defineEmits(['onChangePage']);
function changePage(page) {
  if (page < 1) {
    // validate page
    currentPage = 0;
  } else if (page >= numPages) {
    currentPage = numPages;
  }
  const startIdx = selectedRows.value * currentPage;
  const endIdx = startIdx + selectedRows.value;
  emit('onChangePage', { startIdx, endIdx });
}

watch(selectedRows, () => changePage(currentPage));
watch(
  () => props.entries,
  () => changePage(0),
);

// ------------------------------------------------
// show all n results and current page in template
// ------------------------------------------------
const numPages = $computed(() => Math.ceil(props.entries / selectedRows.value) - 1);

const currentPageView = $computed(() => {
  const fromEntries = selectedRows.value * currentPage;
  const uptoEntries = fromEntries + selectedRows.value;
  const beginStr = (fromEntries + 1).toLocaleString();
  const uptoStr = (fromEntries + selectedRows.value <= props.entries ? uptoEntries : props.entries).toLocaleString();
  return `${beginStr}-${uptoStr}`;
});

// TODO: scroll to top on pagination or select rows
</script>

<template>
  <div class="pagination-wrapper space-between">
    <div class="inline-center rows-controls">
      <div class="dropdown">
        <select
          v-model="selectedRows"
          @change="changePage(currentPage)"
        >
          <option
            v-for="rowOption in rowsOptions"
            :key="rowOption.id"
            :value="rowOption"
            v-text="`${rowOption} rows`"
          />
        </select>
      </div>
    </div>

    <div class="controls-wrapper">
      <p class="page-position">{{ currentPageView }} <span class="text-muted">of</span> {{ entries.toLocaleString() }}</p>

      <div class="pagination-group">
        <span
          @click="changePage(0)"
          class="icon-btn align-center"
          :class="{ disabled: currentPage === 0 }"
        >
          <IconBackward class="icon --pagination" />
        </span>
        <span
          @click="prevPage()"
          class="icon-btn align-center"
          :class="{ disabled: currentPage === 0 }"
        >
          <IconLeft class="icon --pagination" />
        </span>
        <span
          @click="nextPage()"
          class="icon-btn align-center"
          :class="{ disabled: currentPage === numPages }"
        >
          <IconRight class="icon --pagination" />
        </span>
        <span
          @click="changePage(numPages)"
          class="icon-btn align-center"
          :class="{ disabled: currentPage === numPages }"
        >
          <IconForward class="icon --pagination" />
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pagination-wrapper {
  display: flex;
  align-items: center;
  padding: var(--space-xs);
  border: 1px solid var(--border-color);
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
  background-color: var(--bg-color1);
}

.inline-center {
  display: inline-flex;
  align-items: center;
}

.controls-wrapper {
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 12px;
}

.pagination-group {
  display: flex;
  align-items: center;
}

.space-between {
  display: flex;
  justify-content: space-between;
}

.page-position {
  white-space: nowrap;
  padding: 6px 0;
}

.icon-btn {
  padding: 6px;
  background-color: var(--pill-bg);
  border: 1px solid var(--btn-border);
  margin: 2px;
  border-radius: var(--border-radius);
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
      fill: var(--text-color-disabled);
    }
  }
}

@media only screen and (max-width: 550px) {
  .pagination-wrapper {
    align-items: flex-start;
  }
  .rows-controls {
    margin-top: 4px;
  }

  .controls-wrapper {
    flex-flow: row wrap;
    justify-content: end;
  }

  .page-position {
    order: 1;
    width: 100%;
    text-align: right;
    padding-right: 4px;
  }
}
</style>
