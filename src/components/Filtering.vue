<script setup>
import { watch } from 'vue'
import FilteringPills from './FilteringPills.vue'

const props = defineProps({
  headers: {
    type: Array
  }
})
const OPERATORS = ['==', '>', '<']
const TIMEOUT = 400

// TODO: add input types validations

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

const emit = defineEmits(['submit', 'remove'])
// cleaning up
function removeFilter (filterIdx) {
  itemRefs.splice(filterIdx, 1)
  inputValids.splice(filterIdx, 1)
  filtersScope.splice(filterIdx, 1)
  filterTags = filtersScope.filter(f => f.value.length)
  emit('submit', filterTags)
}
function removeAllfilters () {
  const len = filterTags.length
  itemRefs.splice(0, len)
  inputValids.splice(0, len)
  filtersScope.splice(0, len)
  filterTags = []
  emit('submit', [])
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

// template filter modal
const showFilterMenu = $ref(false)
const filterModal = $ref(null)

function openModal () {
  showFilterMenu = !showFilterMenu
}
window.onclick = function (e) {
  const modalDims = getModalDims()
  const isInnerX = e.clientX < modalDims.right && e.clientX > modalDims.left || e.clientX === 0
  const isInnerY = e.clientY > modalDims.top - 24 && e.clientY < modalDims.bottom || e.clientY === 0
  if (showFilterMenu && (!isInnerX || !isInnerY)) {
    showFilterMenu = false
  }
}
function getModalDims () {
  const { left, top, right, bottom } = filterModal.getBoundingClientRect()
  return { left, top, right, bottom }
}

// validations
const inputValids = $ref([])
function validate (userInput) {
  return !isNaN(parseFloat(userInput)) && isFinite(userInput)
}
</script>

<template>
  <button @click="openModal()" type="button" class="filter-btn">
    Filter <span v-if="filterTags.length">| {{ filterTags.length }} applied</span>
  </button>

  <!-- pills -->
  <FilteringPills v-if="filterTags.length" :filterTags="filterTags" :headers="headers"
    @removeSingleFilter="removeFilter" @removeAllfilters="removeAllfilters" />

  <div v-show="showFilterMenu" ref="filterModal" class="filter-modal box">
    <!-- message -->
    <div v-if="filtersScope.length === 0">
      No filters applied
    </div>
    <!-- filter inputs -->
    <div v-for="(filter, idx) in filtersScope" :key="idx">
      <!-- choose a column -->
      <select v-model="filter.columnKey">
        <option v-for="head in headers" :key="head.id" :value="head.columnKey">
          {{ head.label }} <span class="text-muted subtitle">({{ head.type }})</span>
        </option>
      </select>
      <!-- choose an operator -->
      <select v-model="filter.operator">
        <option v-for="operator in OPERATORS" :key="operator.id" v-text="operator" />
      </select>
      <!-- filter by value -->
      <!-- TODO: inputmode="numeric" with floats? -->
      <input type="text" @keyup="updateValue($event, idx)" :ref="(input) => { itemRefs[idx] = input }" pattern="[0-9.]+"
        :class="{ 'invalid': !inputValids[idx] }">
      <!-- remove filter -->
      <button @click="removeFilter(idx)" v-text="'&#9587;'" />
      <!-- show invalid message -->
      <div class="error" v-if="!inputValids[idx]">Invalid value</div>
    </div>
    <div class="space-between mt-6">
      <button @click="addFilter()" v-text="'+ Add filter'" />
      <button @click="removeAllfilters()" :disabled="filterTags.length === 0" v-text="'- Remove all filter'" />
    </div>
  </div>
</template>

<style>
.subtitle {
  text-transform: capitalize;
}

.error {
  color: red;
}

.filter-btn {
  margin-left: 24px;
}

.filter-modal {
  position: absolute;
  z-index: 5;
  background-color: var(--bg-color1);
  top: 40px;
  left: 24px;
}

.invalid,
input:invalid,
input:invalid:focus {
  border-color: red;
  outline: none;
}
</style>
