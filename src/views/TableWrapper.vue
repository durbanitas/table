<script setup>
import TableParent from '../components/Table/TableParent.vue'
import { onBeforeMount } from 'vue'
import { getData } from '../utils/helpers.js'
// demo data
import { DEMO_CHARACTERS } from '../utils/demo_data.js'

const HEADERS = ['name', 'height', 'mass', 'created']

// Alternativ: 
// const HEADERS = [
//   {
//     key: 'name',
//     type: 'String', // String, Number, Date
//     label: 'Name',
//     align: 'start', // start, center, end
//     sortable: true,
//   }
// ]

const isDev = true
let loading = $ref(true)
let characters = $ref([])
let tableData = $ref({})

// get data
if (isDev) {
  setTimeout(() => characters = DEMO_CHARACTERS, 200)
  setTimeout(() => tableData.headers = HEADERS, 100)
  setTimeout(() => tableData.data = createDataset(HEADERS, characters), 300)
  setTimeout(() => loading = false, 1000)
}
onBeforeMount(() => {
  if (isDev) return
  tableData.headers = HEADERS
  const urls = ['https://swapi.dev/api/people/']
  getData(urls).then(data => {
    if (!data.error) {
    const response = data.results[0].results
    characters = response
    const planetUrls = response.map(ch => ch.homeworld)
    const uniqueUrls = [...new Set(planetUrls)]
      getData(uniqueUrls)
        .then(data => {
          if (!data.error) {
            tableData.data = createDataset(HEADERS, characters)
            loading = false
          } else {
            console.error(data.error)
          }
        })
    } else {
      console.error(data.error)
    }
  })
})

function createDataset(headers, characters) {
  return headers.map(head => characters.map(c => c[head]))
}
</script>

<template>
<div v-if="loading" class="align-center loading-table-size">
  loading table
</div>
<div v-else>
  <TableParent
    :headers="tableData.headers"
    :tableData="tableData.data"
    :defaultSortDirection="-1"
    :defaultSortByHeader="'name'"
    :rowsPerPage="40"
  />
</div>
</template>

<style>
.loading-table-size {
  height: 400px;
  border: 1px solid #ccc;
}
</style>
