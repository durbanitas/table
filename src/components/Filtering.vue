<script setup>
import { watch } from 'vue';

const props = defineProps({
  headers: {
    type: Array
  }
})
const OPERATORS = ['==', '>', '<']
const TIMEOUT = 400

// TODO: add autofocus
// TODO: add input validation

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
  isValid.push(true)
}
function removeFilter (idx) {
  itemRefs.splice(idx, 1);
  isValid.splice(idx, 1)
  filtersScope.splice(idx, 1)
  filterTags = filtersScope.filter(f => f.value.length)
  emit('submit', filterTags)
}

watch(() => [...itemRefs], (oldVal, newVal) => setFocus(oldVal, newVal))
function setFocus (oldVal, newVal) {
  const oldArrLen = oldVal.filter(el => el !== null).length
  const newArrLen = newVal.filter(el => el !== null).length
  if (newArrLen < oldArrLen) itemRefs[newArrLen].focus()
}

function emitValue () {
  const allValid = isValid.findIndex(valid => valid === false) < 0
  if (allValid) {
    itemRefs.forEach((input, idx) => {
      if (input !== null) filtersScope[idx].value = input.value
    })
    filterTags = filtersScope.filter(f => f.value.length)
    emit('submit', filterTags)
  }
  // else {
  //   console.error('wrong input value(s)')
  // }
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

// validations
function validateInput (e, idx) {
  let isNumber = true
  if (e.target.value.length) {
    isNumber = !isNaN(parseFloat(e.target.value)) && isFinite(e.target.value)
  }
  isValid[idx] = isNumber
}
const isValid = $ref([])
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
      <input type="text" @keyup="updateValue" :ref="(input) => { itemRefs[idx] = input }"
        @change="validateInput($event, idx)" @input="validateInput($event, idx)" :value="filter.value">
      <!-- remove filter -->
      <button @click="removeFilter(idx)" v-text="'x'" />
      <!-- show invalid message -->
      <div class="error" v-if="!isValid[idx]">invalid value</div>
    </div>

    <button @click="addFilter()" v-text="'add filter +'" />
  </div>
</template>

<style>
.error {
  color: red;
}
</style>
