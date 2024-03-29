<script setup>
import { watch } from 'vue';
import IconFilter from '../assets/svgs/filter.svg';
import IconPlus from '../assets/svgs/plus.svg';
import IconMinus from '../assets/svgs/minus.svg';
import IconClose from '../assets/svgs/cross.svg';
import IconTrash from '../assets/svgs/trash.svg';

const props = defineProps({
  headers: {
    type: Array,
  },
});
const OPERATORS = ['==', '>', '<'];
const TIMEOUT = 400;

let filtersScope = $ref([{ columnKey: 0, operator: '==', value: '' }]);
let filterTags = $ref([]);
let itemRefs = $ref([{ type: 'text', class: '', pattern: '[0-9.]+', style: 'margin-top: -1px; padding-bottom: 2px;' }]);

function addFilter() {
  const filterObj = {
    columnKey: props.headers[0].columnKey,
    operator: '==',
    value: '',
  };
  filtersScope.push(filterObj);
  validInputs.push(true);
}
// set autofocus
watch(
  () => [...itemRefs],
  (oldVal, newVal) => setFocus(oldVal, newVal),
);
function setFocus(oldTempRefs, newTempRefs) {
  const oldTempRefsLen = oldTempRefs.filter((ref) => ref !== null).length;
  const newTempRefsLen = newTempRefs.filter((ref) => ref !== null).length;
  if (newTempRefsLen < oldTempRefsLen) itemRefs[newTempRefsLen].focus();
}

const emit = defineEmits(['submit', 'remove']);
// cleaning up
function removeFilter(filterIdx) {
  itemRefs.splice(filterIdx, 1);
  validInputs.splice(filterIdx, 1);
  filtersScope.splice(filterIdx, 1);
  filterTags = getValidValues();
  emit('submit', filterTags);
  // added if condition to prevent closing by click
  if (filtersScope.length === 0) removeAll = true;
}

let removeAll = $ref(false);
function removeAllfilters() {
  removeAll = true;
  const len = filtersScope.length;
  itemRefs.splice(0, len);
  validInputs.splice(0, len);
  filtersScope.splice(0, len);
  filterTags = [];
  emit('submit', []);
}

function emitValue(inputVal, filterIdx) {
  let isValidInput = validate(inputVal, filterIdx) || inputVal.length === 0;
  filtersScope[filterIdx].value = inputVal;
  validInputs[filterIdx] = isValidInput;
  filterTags = getValidValues();
  emit('submit', filterTags);
}
function getValidValues() {
  const arr = [];
  validInputs.forEach((v, idx) => {
    if (v && filtersScope[idx].value.length) {
      const type = getFilterType(idx);
      if (type === 'date') {
        const unix = parseInt(new Date(filtersScope[idx].value).getTime().toFixed(0));
        const obj = JSON.parse(JSON.stringify(filtersScope[idx]));
        obj.value = unix;
        obj.operator = filtersScope[idx].operator;
        arr.push(obj);
      } else {
        const obj = JSON.parse(JSON.stringify(filtersScope[idx]));
        arr.push(obj);
      }
    }
  });
  return arr;
}

let lastChangedCol = $ref('');
function changeColumn(filterIdx) {
  const type = getFilterType(filterIdx);
  if (lastChangedCol !== type) {
    emitValue('', filterIdx);
    lastChangedCol = type;
  }
}
function changeOperator(filterIdx) {
  const type = getFilterType(filterIdx);
  const gotValue = filtersScope[filterIdx].value.length > 0;
  if (type === 'date' && gotValue) {
    emitValue(filtersScope[filterIdx].value, filterIdx);
  }
}

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
const updateValue = debounce((userInput, filterIdx) => emitValue(userInput, filterIdx), TIMEOUT);
const handleInput = function (e, filterIdx) {
  const userInput = e.target.value;
  filtersScope[filterIdx].value = userInput;
  const isValid = e.target.validity.valid;
  if (isValid) {
    validInputs[filterIdx] = true;
    updateValue(userInput, filterIdx);
  } else {
    validInputs[filterIdx] = false;
  }
};

// template filter modal
let showFilterMenu = $ref(false);
let filterModal = $ref(null);
let filterBtn = $ref(null);

function openModal() {
  showFilterMenu = !showFilterMenu;
}
window.onclick = (e) => {
  if (!showFilterMenu) return;
  const btnDims = getDimensions(filterBtn);
  const modalDims = getDimensions(filterModal);
  const isOuterClick = isClickedOutsideModal(e, btnDims, modalDims);
  if (showFilterMenu && isOuterClick && !removeAll) showFilterMenu = false;
  removeAll = false;
};
function getDimensions(tempRef) {
  const { left, top, right, bottom } = tempRef.getBoundingClientRect();
  return { left, top, right, bottom };
}
function isClickedOutsideModal(e, btnDims, modalDims) {
  const isOuterBtnX = (e.clientX < btnDims.left || e.clientX > btnDims.right) && e.clientX > 0;
  const isOuterBtnY = e.clientY < btnDims.top && e.clientY > 0;
  const isOuterX = (e.clientX < modalDims.left || e.clientX > modalDims.right) && e.clientX > 0;
  const isOuterY = (e.clientY < modalDims.top || e.clientY > modalDims.bottom) && e.clientY > 0;
  const isNav = e.clientY > 40;
  const isOuterClick = (isOuterX || isOuterY) && (isOuterBtnX || isOuterBtnY) && isNav;
  return isOuterClick;
}

function getFilterType(filterIdx) {
  const KEY = filtersScope[filterIdx].columnKey;
  return props.headers.find((h) => h.columnKey === KEY).type;
}
// validations
let validInputs = $ref([true]);
function validate(userInput, filterIdx) {
  const type = getFilterType(filterIdx);
  if (type === 'number') {
    return !isNaN(parseFloat(userInput)) && isFinite(userInput);
  } else if (type === 'string') {
    return userInput;
  } else if (type === 'date') {
    return userInput;
  }
}
</script>

<template>
  <button
    @click="openModal()"
    ref="filterBtn"
    type="button"
    class="filter-btn"
    :class="{ active: showFilterMenu }"
  >
    <IconFilter class="icon" />
    <span class="pl-6">Filters</span>
    <span
      class="pill"
      :class="{ 'warning-pill': filterTags.length > 0 }"
      >{{ filterTags.length }}</span
    >
  </button>

  <div
    v-show="showFilterMenu"
    ref="filterModal"
    class="filter-modal box"
  >
    <div class="flex-end">
      <button
        @click="showFilterMenu = false"
        class="close-btn minimal"
      >
        <IconClose class="icon" />
      </button>
    </div>

    <!-- message -->
    <div v-if="filtersScope.length === 0">No filters applied</div>

    <!-- filter inputs -->
    <div
      v-for="(filter, idx) in filtersScope"
      :key="idx"
    >
      <div class="button-group">
        <!-- choose a column -->
        <select
          v-model="filter.columnKey"
          @change="changeColumn(idx)"
        >
          <option
            v-for="head in headers"
            :key="head.id"
            :value="head.columnKey"
          >
            {{ head.label }} <span class="text-muted subtitle">({{ head.type }})</span>
          </option>
        </select>

        <!-- choose an operator -->
        <select
          v-model="filter.operator"
          @change="changeOperator(idx)"
        >
          <option
            v-for="operator in OPERATORS"
            :key="operator.id"
            v-text="operator"
          />
        </select>

        <!-- filter by value -->
        <template v-if="getFilterType(idx) === 'number'">
          <input
            type="text"
            @input="handleInput($event, idx)"
            :ref="
              (input) => {
                itemRefs[idx] = input;
              }
            "
            :class="{ invalid: !validInputs }"
            pattern="[0-9.]+"
            :value="filter.value"
          />
        </template>
        <template v-else-if="getFilterType(idx) === 'date'">
          <input
            type="date"
            @change="handleInput($event, idx)"
            :ref="
              (input) => {
                itemRefs[idx] = input;
              }
            "
            :value="filter.value"
          />
        </template>
        <template v-else>
          <input
            type="text"
            @keyup="handleInput($event, idx)"
            :ref="
              (input) => {
                itemRefs[idx] = input;
              }
            "
            :value="filter.value"
          />
        </template>

        <!-- remove filter -->
        <button
          @click="removeFilter(idx)"
          class="close-btn"
        >
          <IconTrash class="icon" />
        </button>
      </div>

      <!-- show invalid message -->
      <div
        class="error"
        v-if="!validInputs[idx]"
      >
        Invalid value
      </div>
    </div>
    <div class="space-between mt-6">
      <button
        @click="addFilter()"
        class="mr-6"
      >
        <IconPlus class="icon" />
        <span class="pl-6">Add filter</span>
      </button>
      <button
        @click="removeAllfilters()"
        :disabled="filtersScope.length === 0"
        class="remove-btn"
      >
        <IconMinus class="icon" />
        <span class="pl-6">Remove all filters</span>
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
  font-size: var(--fs-300);
  height: 30px;
  margin: 0px 6px 0px 12px;
}

.filter-modal {
  border: 1px solid #ccc;
  margin: var(--space-xs) 0 var(--space-xs) 0;
  padding: var(--space-xs);
  position: absolute;
  z-index: 5;
  background-color: var(--bg-color2);
  top: 54px;
  border-radius: var(--border-radius);
  border-color: var(--btn-border);
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  min-width: 402px;
  margin-left: 12px;
  margin-top: 34px;
}

input[type='date'] {
  width: 149px;
}

.invalid,
input:invalid,
input:invalid:focus {
  border-color: var(--remove);
  outline: none;
}

@media only screen and (max-width: 550px) {
  .filter-modal {
    min-width: 350px;
  }
}
</style>
