<script setup>
import IconClose from '../assets/svgs/cross.svg'
import IconSmallClose from '../assets/svgs/small-cross.svg'

const props = defineProps({
  filterTags: {
    type: Array
  },
  headers: {
    type: Array
  }
})
const emit = defineEmits(['removeSingleFilter', 'removeAllfilters'])

// template labeling
function pillLabel (filter) {
  return getColLabel(filter.columnKey) + ' ' + filter.operator + ' ' + filter.value
}
function getColLabel (colKey) {
  return props.headers.find(h => h.columnKey === colKey).label
}

// remove filters
function removeSingleFilter (filterIdx) {
  emit('removeSingleFilter', filterIdx)
}
function removeAllfilters () {
  emit('removeAllfilters')
}
// TODO: remove all filters -> show question really? yes/no
</script>

<template>
  <div class="global-pill">
    <div v-for="(filter, filterIdx) in filterTags" :key="filter.id" class="single-pill align-center">
      {{ pillLabel(filter) }}
      <span @click="removeSingleFilter(filterIdx)" class="remove-single">
        <IconSmallClose />
      </span>
    </div>
    <span @click="removeAllfilters()" class="remove-all">
      <IconClose />
    </span>
  </div>
</template>

<style lang="scss" scoped>
// TODO: better contrast for closing icons
.global-pill {
  width: fit-content;
  padding: 6px;
  margin: 4px;
  border-radius: 4px;
  background-color: var(--bg-color0);

  .single-pill {
    background-color: var(--single-pill-bg);
    color: var(--font-color);
    display: inline-flex;
    font-size: 12px;
    max-width: 100%;
    height: 20px;
    min-width: 20px;
    padding: 2px 6px;
    position: relative;
    margin-right: 4px;
    border-radius: 4px
  }

  .remove-single svg {
    display: flex;
    align-items: center;
    margin-left: 4px;
    width: 16px;
    height: 16px;
    fill: var(--icon-color);

    &:hover {
      fill: var(--remove);
      cursor: pointer;
    }
  }

  .remove-all svg {
    position: relative;
    top: 4px;
    width: 16px;
    height: 16px;
    fill: var(--icon-color);

    &:hover {
      fill: var(--remove);
      cursor: pointer;
    }
  }
}
</style>
