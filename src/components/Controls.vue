<script setup>
import { onBeforeMount } from 'vue'
const emit = defineEmits(['passNewDataset'])
// user selection
let userColumns = $ref(4)
let userRows = $ref(10)
// new dataset
let data = []
let headers = []

onBeforeMount(() => {
  createDataset()
})

function createDataset() {
  data = []
  headers = []
  for (let i = 0; i < userColumns; i++) {
    const arr = new Array(userRows).fill(null)
    for (let idx = 0; idx < arr.length; idx++) {
      arr[idx] = createN()
    }
    data.push(arr)
    const head = {
      key: i,
      label: 'Col' + i,
      type: 'number'
    }
    headers.push(head)
  }
  emit('passNewDataset', { data, headers })
}
function createN() {
  // add row idx to each value
  return Number((Math.random() * 100).toFixed())
  // return (Math.random() * 100).toFixed()
}
function reset() {
  userColumns = 4
  userRows = 10
  createDataset()
}
</script>

<template>
  <div class="button-group">
    <button @click="userRows *= 10" v-text="'increase rows: ' + userRows" />
    <button @click="userColumns++" v-text="'increase columns: ' + userColumns" />
    <button @click="createDataset()" v-text="'create'" />
    <button @click="reset()" v-text="'reset'" />
  </div>
</template>

<style class="scss" scoped>
.button-group {
  padding: 12px;
}
</style>
