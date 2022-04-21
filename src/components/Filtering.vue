<script setup>
import { watch } from 'vue'

const props = defineProps({
  headers: {
    type: Array
  }
})
const OPERATORS = ['==', '>', '<']
const TIMEOUT = 400

// TODO: add input types validations

const emit = defineEmits(['submit', 'remove'])
const filtersScope = $ref([])
const filterTags = $ref([])
const itemRefs = $ref([])

function addFilter () {
  const filterObj = {
    columnKey: props.headers[0].columnKey,
    operator: '==',
    value: ''
  }
  filtersScope.push(filterObj)
  inputValids.push(true)
}
// set autofocus
watch(() => [...itemRefs], (oldVal, newVal) => setFocus(oldVal, newVal))
function setFocus (oldVal, newVal) {
  const oldArrLen = oldVal.filter(el => el !== null).length
  const newArrLen = newVal.filter(el => el !== null).length
  if (newArrLen < oldArrLen) itemRefs[newArrLen].focus()
}
function removeFilter (idx) {
  itemRefs.splice(idx, 1);
  inputValids.splice(idx, 1)
  filtersScope.splice(idx, 1)
  filterTags = filtersScope.filter(f => f.value.length)
  emit('submit', filterTags)
}

function emitValue (inputVal, idx) {
  let isValidInput = validate(inputVal) || inputVal.length === 0
  if (isValidInput) {
    inputValids[idx] = true
    filtersScope[idx].value = inputVal
    filterTags = filtersScope.filter(f => f.value.length)
    emit('submit', filterTags)
  } else {
    inputValids[idx] = false
  }
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
const updateValue = debounce((e, idx) => emitValue(e.target.value, idx), TIMEOUT)

// validations
const inputValids = $ref([])
function validate (val) {
  return !isNaN(parseFloat(val)) && isFinite(val)
}
</script>

<template>
  <div class="box">
    <div v-for="(filter, idx) in filtersScope" :key="idx">
      <!-- choose a column -->
      <select v-model="filter.columnKey">
        <option v-for="head in props.headers" :key="head.id" :value="head.columnKey" v-text="head.label" />
      </select>
      <!-- choose an operator -->
      <select v-model="filter.operator">
        <option v-for="operator in OPERATORS" :key="operator.id" v-text="operator" />
      </select>
      <!-- filter by value -->
      <input type="text" @keyup="updateValue($event, idx)" :ref="(input) => { itemRefs[idx] = input }">
      <!-- remove filter -->
      <button @click="removeFilter(idx)" v-text="'x'" />
      <!-- show invalid message -->
      <div class="error" v-if="!inputValids[idx]">invalid value</div>
    </div>

    <button @click="addFilter()" v-text="'add filter +'" />
  </div>
</template>

<style>
.error {
  color: red;
}
</style>
