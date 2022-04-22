<script setup>
const props = defineProps({
  filterTags: {
    type: Array
  },
  headers: {
    type: Array
  }
})
const emit = defineEmits(['removeSingleFilter', 'removeAllfilters'])

// template labeling
function pillLabel (filter) {
  return getColLabel(filter.columnKey) + ' ' + filter.operator + ' ' + filter.value
}
function getColLabel (colKey) {
  return props.headers.find(h => h.columnKey === colKey).label
}

// remove filters
function removeSingleFilter (filterIdx) {
  emit('removeSingleFilter', filterIdx)
}
function removeAllfilters () {
  emit('removeAllfilters')
}
// TODO: remove all filters -> show question really? yes/no
</script>

<template>
  <div class="global-pill">
    <div v-for="(filter, filterIdx) in filterTags" :key="filter.id" class="single-pill">
      {{ pillLabel(filter) }}
      <button @click="removeSingleFilter(filterIdx)" class="remove-single">×</button>
    </div>
    <button @click="removeAllfilters()" class="remove-all" title="remove all filters">×</button>
  </div>
</template>

<style lang="scss" scoped>
.global-pill {
  background-color: #ccc;
  padding: 2px;
  font-size: 12px;
  width: fit-content;
  margin: 6px 0 6px 0;
  border-radius: 32px;

  .single-pill {
    background-color: var(--bg-color1);
    color: var(--font-color);
    padding: 2px 6px;
    margin: 6px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    border-radius: 12px;
  }

  button {
    cursor: pointer;
  }

  .remove-all {
    position: relative;
    margin: 8px;
    text-decoration: none;
    font-size: 12px;
  }

  .remove-single {
    text-decoration: none;
    font-size: 12px;
  }
}
</style>
