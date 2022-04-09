<script setup>

// filterTags [] in parent
// filter input is for the latest filterTag
// typing will be updating the value
// use debounce for typing -> emit
// click on pill will remove this filter from filterTags
// click on addFilter will be create a new filter obj

// get header type
// if number use ==, <, >
// if string use == // match case or whole word (ignore upper/lower)
// if date use ==, <, > and date input
// <input type="date" value="2017-06-01">

// dropdown 1: select a column -> show datatype
// dropdown 2: select an operator
// input: enable if dd1 & dd2 are filled





const props = defineProps({
  headers: {
    type: Array
  }
})
const emit = defineEmits(['submit'])
const selectedHeader = $ref('')
const selectedOperator = $ref('')
const selectedValue = $ref('')
const filterTags = $ref([])
const operators = [
  '==',
  '>',
  '<'
]

// TODO: only submit new filter
function useFilter() {
  const obj = {
    columnKey: selectedHeader,
    operator: selectedOperator,
    value: selectedValue
  }
  filterTags.push(obj)
  emit('submit', filterTags)
  resetInputs()
}
function resetInputs() {
  selectedHeader = ''
  selectedOperator = ''
  selectedValue = ''
}
</script>

<template>
<!-- select a header -->
<form>
  <label>Filter by:</label>
  <select v-model="selectedHeader">
    <option v-for="head in props.headers" :value="head.columnKey">{{ head.label }}</option>
  </select>
  <!-- select an operator -->
  <select v-model="selectedOperator">
    <option v-for="operator in operators">{{ operator }}</option>
  </select>
  <!-- select a value -->
  <input type="text" v-model="selectedValue">
  <!-- submit filter -->
  <button @click.prevent="useFilter()" v-text="'use filter'" />
</form>

<!-- remove pills -->
<div class="filter-list">
  <span v-for="(p, idx) in filterTags" @click="filterTags.splice(idx, 1)" class="pill">
    {{ p.columnKey }}: {{ p.operator }} {{ p.value }}
  </span>
</div>

</template>

<style lang="scss" scoped>
form {
  padding: 8px;
}
.filter-list {
  padding: 12px;
}
.pill {
  background-color: #ccc;
  padding: 4px;
  font-size: 12px;
  border-radius: 30px;
  margin: 8px;
  &:hover {
    background-color: #ddd;
    cursor: pointer;
  }
}
</style>
