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
  // currentPage: Number,
})

const currentPage = $ref(0)

// currentPage in parent?
// TODO: update displayList when rowsPerPage changes
const emit = defineEmits(['onChangePage'])
function displayList(direction) {
  const { entries, rowsPerPage  } = props
  if (direction === 'prev') {
    if (currentPage <= 0) return
    currentPage--
  } else if (direction === 'next') {
    const maxEnd = entries / rowsPerPage
    if (currentPage >= maxEnd - 1) return
    currentPage++
  }
  const startIdx = rowsPerPage * currentPage
  const endIdx = startIdx + rowsPerPage
  emit('onChangePage', { startIdx, endIdx })
}

// template
const currentPageView = computed(() => {
  return `${props.rowsPerPage * (currentPage) + 1} - ${(props.rowsPerPage * currentPage) + props.rowsPerPage}`
})
</script>

<template>
  <div class="pagination-wrapper space-between">

    <!-- navigation -->
    <div />

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
