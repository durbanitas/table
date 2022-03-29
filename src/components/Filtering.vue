<script setup>
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
// TODO: adapt filter by typing
const operators = [
  'isEqual',
  'isLess',
  'isGreater'
]

function useFilter() {
  const obj = {
    key: selectedHeader,
    operator: selectedOperator,
    value: selectedValue,
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
    <option v-for="head in props.headers" :value="head.key">{{ head.label }}</option>
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
    {{ p.key }}: {{ p.operator }} {{ p.value }}
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
