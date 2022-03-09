<script setup>
import { computed } from 'vue'

const props = defineProps({
  entries: {
    type: Number,
    required: true
  },
  selectedRows: {
    type: Number,
    default: 10
  }
  // currentPage: Number,
})

const currentPage = $ref(1)

// currentPage in parent?
// TODO: update displayList when selectedRows changes
const emit = defineEmits(['onChangePage'])
function displayList(direction) {
  const { entries, selectedRows  } = props
  if (direction === 'prev') {
    if (currentPage <= 0) return
    currentPage--
  } else if (direction === 'next') {
    const maxEnd = entries / selectedRows
    if (currentPage >= maxEnd - 1) return
    currentPage++
  }
  const startIdx = selectedRows * currentPage
  const endIdx = startIdx + selectedRows
  emit('onChangePage', { startIdx, endIdx })
}

// template
const currentPageView = computed(() => {
  return `${props.selectedRows * (currentPage)}-${(props.selectedRows * currentPage) + props.selectedRows}`
})
</script>

<template>
  <div class="pagination-wrapper space-between">

    <!-- navigation -->
    <div>
      Page: {{ currentPage +1 }}
      <!-- <span class="icon"> &#171; </span> -->
      <span class="icon" @click="displayList('prev')"> &#8249; </span>
      <span class="icon" @click="displayList('next')"> &#8250; </span>
      <!-- <span class="icon"> &#187; </span> -->
    </div>

    <!-- entries -->

    <div>{{ currentPageView }} of {{ entries }} entries</div>
    <!-- rows per page -->
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
