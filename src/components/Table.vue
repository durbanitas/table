<script setup>
import { defineProps, computed, ref } from 'vue'

const props = defineProps({
  titles: Array,
  content: Array,
  searchName: {
    type: String,
    default: ''
  }
})
const sortDirection = ref(1) // 1 & -1
const sortField = ref('mass') // name, height, mass
const sortType = ref('Number')
// TODO: type: 'Number' vs Number

// sort methods
const sortMethod = {
  'String': '',
  'Number': sortDirection.value === -1 ?
    (char1, char2) => char2[sortField.value] - char1[sortField.value] :
    (char1, char2) => char1[sortField.value] - char2[sortField.value]
}
// filtered results
const filteredTable = computed(() => {
  return props.content.filter(el => {
    return el
  }).sort(sortMethod[sortType.value])
})

</script>

<template>
  <div class="table-container">
    <table>
      <!-- titles -->
      <thead>
        <tr>
          <th
            v-for="(title, idx) in props.titles"
            :key="title.id"
          >
            {{ title.name }}
          </th>
        </tr>
      </thead>
      <!-- BODY -->
      <tbody>
        <template v-if="filteredTable.length">
          <tr
            v-for="(n, i) in filteredTable"
            :key="n.id"
          >
            <td v-for="(title, idx) in titles">
              <span>
                {{ n[title.name] }}
              </span>
            </td>
          </tr>
        </template>

        <!-- handle no results -->
        <template v-else>
          <tr>
            <td
              :colspan="props.titles.length"
              v-text="'No results'"
            />
          </tr>
        </template>

      </tbody>
    </table>
  </div>
</template>


<style lang="scss" scoped>
// TODO: cross cell highlighting row & column & cell
// - use mouseover events & JS
.table-container {
  position: relative;
  max-height: 400px;
  width: 100%;
  overflow: scroll;
}

table {
  border-collapse: collapse; // removes border-spacing
  font-family: helvetica;
  text-transform: capitalize;
  // cell settings & sizes
  td,
  th {
    border: 0;
    padding: 10px;
    min-width: auto;
    // background: #fff;
    box-sizing: border-box;
    text-align: left;
  }
  // custom titles
  thead th {
    position: sticky;
    top: 0;
    z-index: 2;
    background: #ffbf9f;
    &:first-child {
      left: 0;
      z-index: 3;
    }
  }
  // border settings & sizes
  tbody {
    overflow: scroll;
    height: 200px;
    // sticky left row
    tr > :first-child {
      position: sticky;
      background: #c2c2c2;
      left: 0;
    }
    & tr:nth-child(odd) {
      background: #ddd;
    }
    & tr:hover {
      background: yellow;
    }
  }
}
</style>
