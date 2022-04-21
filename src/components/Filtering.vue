<script setup>
import { watch } from 'vue'

const props = defineProps({
  headers: {
    type: Array
  }
})
const OPERATORS = ['==', '>', '<']
const TIMEOUT = 400

// Filter layout
const openFilters = $ref(false)
const filterModal = $ref(null)

function openModal () {
  openFilters = !openFilters
  // TODO: close modal by click/touch
  // add a remove listener for clicking outside the modal
  // close modal and remove event listener
}

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
function setFocus (oldTempRefs, newTempRefs) {
  const oldTempRefsLen = oldTempRefs.filter(ref => ref !== null).length
  const newTempRefsLen = newTempRefs.filter(ref => ref !== null).length
  if (newTempRefsLen < oldTempRefsLen) itemRefs[newTempRefsLen].focus()
}
// cleaning up
function removeFilter (filterIdx) {
  itemRefs.splice(filterIdx, 1)
  inputValids.splice(filterIdx, 1)
  filtersScope.splice(filterIdx, 1)
  filterTags = filtersScope.filter(f => f.value.length)
  emit('submit', filterTags)
}

function emitValue (inputVal, filterIdx) {
  let isValidInput = validate(inputVal) || inputVal.length === 0
  if (isValidInput) {
    inputValids[filterIdx] = true
    filtersScope[filterIdx].value = inputVal
    filterTags = filtersScope.filter(f => f.value.length)
    emit('submit', filterTags)
  } else {
    inputValids[filterIdx] = false
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
const updateValue = debounce((e, filterIdx) => emitValue(e.target.value, filterIdx), TIMEOUT)

// validations
const inputValids = $ref([])
function validate (userInput) {
  return !isNaN(parseFloat(userInput)) && isFinite(userInput)
}
</script>

<template>
  <button @click="openModal()" type="button" id="closeModal">
    Filter <span v-if="filterTags.length">| {{ filterTags.length }} applied</span>
  </button>

  <div v-show="openFilters" ref="filterModal" class="filter-modal box">
    <!-- message -->
    <div v-if="filtersScope.length === 0">
      No filters are applied
    </div>
    <!-- filter inputs -->
    <div v-for="(filter, idx) in filtersScope" :key="idx">
      <!-- choose a column -->
      <select v-model="filter.columnKey">
        <option v-for="head in props.headers" :key="head.id" :value="head.columnKey">
          {{ head.label }} <span class="text-muted subtitle">({{ head.type }})</span>
        </option>
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
      <div class="error" v-if="!inputValids[idx]">Invalid value</div>
    </div>
    <button @click="addFilter()" v-text="'+ Add filter'" />
  </div>
</template>

<style>
.subtitle {
  text-transform: capitalize;
}

.error {
  color: red;
}

.filter-modal {
  position: absolute;
  z-index: 5;
  background-color: var(--bg-color1);
}
</style>
