<script setup>
const props = defineProps({
  headers: {
    type: Array
  }
})
const OPERATORS = ['==', '>', '<']
const TIMEOUT = 400

const emit = defineEmits(['submit', 'remove'])
const filtersScope = $ref([])
const filterTags = $ref([])

function addFilter () {
  const filterObj = { columnKey: '', operator: '', value: '' }
  filtersScope.push(filterObj)
}
function removeFilter (idx) {
  filtersScope.splice(idx, 1)
  filterTags = filtersScope.filter(f => f.value.length)
  emit('submit', filterTags)
}
// TODO: trim ref instances
const itemRefs = $ref([])
function emitValue () {
  itemRefs.forEach((input, idx) => {
    if (input.type === 'text') filtersScope[idx].value = input.value
  })
  filterTags = filtersScope.filter(f => f.value.length)
  emit('submit', filterTags)
}
const debounce = (func, wait) => {
  let timeout
  return function executedFunction (...args) {
    const later = () => {
      timeout = null
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
const updateValue = debounce(() => emitValue(), TIMEOUT)
</script>

<template>
  <div v-for="(filter, idx) in filtersScope" :key="filter.id" ref="itemRefs">
    <!-- choose column -->
    <select v-model="filter.columnKey">
      <option value="" disabled selected hidden v-text="'select a column'" />
      <option v-for="head in props.headers" :value="head.columnKey" v-text="head.label" placeholder="c" />
    </select>
    <!-- operator -->
    <select v-model="filter.operator">
      <option value="" disabled selected hidden v-text="'select an operator'" />
      <option v-for="operator in OPERATORS" v-text="operator" />
    </select>
    <!-- filter by value -->
    <input type="text" :disabled="filter.columnKey.length === 0 || filter.operator.length === 0" @keyup="updateValue"
      :ref="(input) => { itemRefs[idx] = input }">
    <!-- remove filter -->
    <button @click="removeFilter(idx)" v-text="'x'" />
  </div>

  <button @click="addFilter()" v-text="'add filter +'" />
</template>
