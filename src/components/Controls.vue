<script setup>
import { onBeforeMount, watch, ref, onMounted } from 'vue'
import { createDataset } from '../utils/demo_data.js'
// 1. simulate websocket?
// updates per second?
// 2. change columns
// 3. change rows
// 4. change datatypes?
// 5. use generated filters?

const emit = defineEmits(['sendData'])

onBeforeMount(() => {
  // recursive?
  // initDataset()
})
onMounted(() => {
  initDataset()

})

const showColumns = ref(5)
const showRows = ref(10_000)
const simulateFilters = $ref(false)
const simulateWebsocket = $ref(false)
const updatesPerSecond = $ref(5)
const tableDataset = $ref({})

function initDataset () {
  const data = createDataset(showColumns.value, showRows.value)
  tableDataset = data
  emit('sendData', data)
}

function updateTable (oldVal, newVal) {
  const oldCol = oldVal[0]
  const oldRows = oldVal[1]
  const newCol = newVal[0]
  const newRows = newVal[1]

  console.log(oldCol, oldRows, newCol, newRows);
  // change columns or rows?
  // if under value trim dataset
  // if over value add to dataset
}
// watch([showColumns, showRows], (newVal, oldVal) => {
//   updateTable(newVal, oldVal)
// })

// validate inputs
function validateNumber (num) {
  console.log(num);
}
</script>

<template>
  <div class="box controls">
    <!-- general table data -->
    <div class="box">
      Columns:
      <input type="number" min="1" max="50" v-model.number="showColumns" @change="validateNumber($event)">
      Rows:
      <input type="number" min="1" max="100_000" v-model.number="showRows">
    </div>
    <!-- simulate websocket -->
    <div class="box">
      <label>
        Websocket:
        <input type="checkbox" v-model="simulateWebsocket">
      </label>
      Updates per second:
      <input type="number" min="1" max="100" v-model.number="updatesPerSecond">
    </div>
    <!-- simulate filter -->
    <div class="box">
      <label>
        Random filters:
        <input type="checkbox" v-model="simulateFilters">
      </label>
    </div>

    <!-- create dataset -->
    <button v-text="'create'" @click="initDataset()" />
  </div>
</template>

<style lang="scss" scoped>
.controls {
  padding: 12px;
}
</style>
