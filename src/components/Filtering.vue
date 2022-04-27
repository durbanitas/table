<script setup>
import { watch } from 'vue'
import FilteringPills from './FilteringPills.vue'
import IconFilter from '../assets/svgs/filter.svg'
import IconPlus from '../assets/svgs/plus.svg'
import IconMinus from '../assets/svgs/minus.svg'
import IconClose from '../assets/svgs/cross.svg'

const props = defineProps({
  headers: {
    type: Array
  }
})
const OPERATORS = ['==', '>', '<']
const TIMEOUT = 400

// TODO: set autofocus on first element if filters are created, but got no value

// TODO: add input types validations

let filtersScope = $ref([])
let filterTags = $ref([])
let itemRefs = $ref([])

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
  filterTags = getValidValues()
  emit('submit', filterTags)
  if (filtersScope.length === 0) removeAll = true
}

function alertDeleteFilters () {
  return confirm('Delete all filters?')
}

let removeAll = $ref(false)
function removeAllfilters () {
  removeAll = true
  // alertDeleteFilters()
  const len = filtersScope.length
  itemRefs.splice(0, len)
  inputValids.splice(0, len)
  filtersScope.splice(0, len)
  filterTags = []
  emit('submit', [])
}

function emitValue (inputVal, filterIdx) {
  let isValidInput = validate(inputVal, filterIdx) || inputVal.length === 0
  filtersScope[filterIdx].value = inputVal
  inputValids[filterIdx] = isValidInput
  filterTags = getValidValues()
  emit('submit', filterTags)
}
function getValidValues () {
  const arr = []
  // console.log(inputValids);
  inputValids.forEach((v, idx) => {
    if (v && filtersScope[idx].value.length) {
      const type = getFilterType(idx)
      if (type === 'date') {
        const unix = parseInt(new Date(filtersScope[idx].value).getTime().toFixed(0))
        const obj = JSON.parse(JSON.stringify(filtersScope[idx]))
        obj.value = unix
        obj.operator = filtersScope[idx].operator
        arr.push(obj)
      } else {
        arr.push(filtersScope[idx])
      }
    }
  })
  return arr
}

function changeOperator (filterIdx) {
  const type = getFilterType(filterIdx)
  const gotValue = filtersScope[filterIdx].value.length > 0
  if (type === 'date' && gotValue) {
    emitValue(filtersScope[filterIdx].value, filterIdx)
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
let showFilterMenu = $ref(false)
let filterModal = $ref(null)
let filterBtn = $ref(null)

function openModal () {
  showFilterMenu = !showFilterMenu
}
window.onclick = e => {
  if (!showFilterMenu) return
  const btnDims = getDimensions(filterBtn)
  const modalDims = getDimensions(filterModal)
  const isOuterClick = isClickedOutsideModal(e, btnDims, modalDims)
  if (showFilterMenu && isOuterClick && !removeAll) showFilterMenu = false
  removeAll = false
}
function getDimensions (tempRef) {
  const { left, top, right, bottom } = tempRef.getBoundingClientRect()
  return { left, top, right, bottom }
}
function isClickedOutsideModal (e, btnDims, modalDims) {
  const isOuterBtnX = (e.clientX < btnDims.left || e.clientX > btnDims.right) && e.clientX > 0
  const isOuterBtnY = (e.clientY < btnDims.top) && e.clientY > 0
  const isOuterX = (e.clientX < modalDims.left || e.clientX > modalDims.right) && e.clientX > 0
  const isOuterY = (e.clientY < modalDims.top || e.clientY > modalDims.bottom) && e.clientY > 0
  const isNav = (e.clientY > 40)
  const isOuterClick = (isOuterX || isOuterY) && (isOuterBtnX || isOuterBtnY) && isNav
  return isOuterClick
}

function getFilterType (filterIdx) {
  const KEY = filtersScope[filterIdx].columnKey
  return props.headers.find(h => h.columnKey === KEY).type
}
// validations
let inputValids = $ref([])
function validate (userInput, filterIdx) {
  const type = getFilterType(filterIdx)
  if (type === 'number') {
    return !isNaN(parseFloat(userInput)) && isFinite(userInput)
  } else if (type === 'string') {
    return userInput
  } else if (type === 'date') {
    return userInput
  }
}
</script>

<template>
  <button @click="openModal()" ref="filterBtn" type="button" class="filter-btn">
    <IconFilter class="icon" />
    <span class="pl-6">Filter</span>
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
      <div class="button-group">
        <!-- choose a column -->
        <select v-model="filter.columnKey">
          <option v-for="head in headers" :key="head.id" :value="head.columnKey">
            {{ head.label }} <span class="text-muted subtitle">({{ head.type }})</span>
          </option>
        </select>
        <!-- choose an operator -->
        <select v-model="filter.operator" @change="changeOperator(idx)">
          <option v-for="operator in OPERATORS" :key="operator.id" v-text="operator" />
        </select>
        <!-- filter by value -->
        <!-- TODO: inputmode="numeric" with floats? -->

        <template v-if="getFilterType(idx) === 'number'">
          <input type="text" @keyup="updateValue($event, idx)" :ref="(input) => { itemRefs[idx] = input }"
            pattern="[0-9.]+" :class="{ 'invalid': !inputValids[idx] }" :value="filter.value">
        </template>
        <template v-else-if="getFilterType(idx) === 'date'">
          <input type="date" @change="updateValue($event, idx)" :ref="(input) => { itemRefs[idx] = input }"
            :value="filter.value">
        </template>
        <template v-else>
          <input type="text" @keyup="updateValue($event, idx)" :ref="(input) => { itemRefs[idx] = input }"
            :class="{ 'invalid': !inputValids[idx] }" :value="filter.value">
        </template>


        <!-- remove filter -->
        <button @click="removeFilter(idx)" close="close-btn">
          <IconClose class="icon" />
        </button>
      </div>
      <!-- show invalid message -->
      <div class="error" v-if="!inputValids[idx]">Invalid value</div>
    </div>
    <div class="space-between mt-6">
      <button @click="addFilter()" class="mr-6">
        <IconPlus class="icon" /><span class="pl-6">Add filter</span>
      </button>
      <button @click="removeAllfilters()" :disabled="filtersScope.length === 0" class="remove-btn">
        <IconMinus class="icon" /><span class="pl-6">Remove all filter</span>
      </button>
    </div>
  </div>
</template>

<style>
.subtitle {
  text-transform: capitalize;
}

.error {
  color: var(--remove);
  margin: 0 10px;
}

.filter-btn {
  margin: 4px;
  text-transform: uppercase;
  letter-spacing: 1.1;
}

.filter-modal {
  position: absolute;
  z-index: 5;
  background-color: var(--bg-color0);
  top: 50px;
  left: 4px;
  border-radius: 4px;
  border-color: var(--btn-border);
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

input[type="date"] {
  width: 149px;
}

.invalid,
input:invalid,
input:invalid:focus {
  border-color: var(--remove);
  outline: none;
}
</style>
