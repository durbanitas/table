<script setup>
import { watch } from 'vue'
import FilteringPills from './FilteringPills.vue'
import IconFilter from '../assets/svgs/filter.svg'
import IconPlus from '../assets/svgs/plus.svg'
import IconMinus from '../assets/svgs/minus.svg'

const props = defineProps({
  headers: {
    type: Array
  }
})
const OPERATORS = ['==', '>', '<']
const TIMEOUT = 400

// TODO: add input types validations

// TODO: open filters change theme, ignore header

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
  if (showFilterMenu && isOuterClick) showFilterMenu = false
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
  const isOuterClick = (isOuterX || isOuterY) && (isOuterBtnX || isOuterBtnY)
  return isOuterClick
}

// validations
let inputValids = $ref([])
function validate (userInput) {
  return !isNaN(parseFloat(userInput)) && isFinite(userInput)
}
</script>

<template>
  <button @click="openModal()" ref="filterBtn" type="button" class="filter-btn">
    <IconFilter class="icon" />
    Filter <span v-if="filterTags.length">| {{ filterTags.length }} applied</span>
  </button>

  <!-- TODO: add sorting btn -->
  <!-- <button type="button" class="sort-btn">
    <IconFilter class="icon" />
    Sort by Col 1
  </button> -->

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
      <button @click="addFilter()">
        <IconPlus class="icon" /> Add filter
      </button>
      <button @click="removeAllfilters()" :disabled="filterTags.length === 0">
        <IconMinus class="icon" /> Remove all filter
      </button>
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
  margin-left: 47px;
  margin-bottom: 6px;
}

.sort-btn {
  margin-top: -6px;
  margin-left: 10px;
}

.filter-modal {
  position: absolute;
  z-index: 5;
  background-color: var(--bg-color1);
  top: 46px;
  left: 47px;
}

.invalid,
input:invalid,
input:invalid:focus {
  border-color: red;
  outline: none;
}
</style>
