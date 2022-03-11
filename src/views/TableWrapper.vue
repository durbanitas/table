<script setup>
import TableParent from '../components/Table/TableParent.vue'
import { onBeforeMount, computed } from 'vue'
import { getData } from '../utils/helpers.js'
// demo data
import { DEMO_CHARACTERS } from '../utils/demo_data.js'

const isDev = true

const HEADERS = [
  {
    key: 'name',
    type: 'string',
    label: 'Name',
    align: 'start',
    sortable: true,
  },
  {
    key: 'height',
    type: 'number',
    label: 'Height (cm)',
    align: 'end',
    sortable: true,
  },
  {
    key: 'mass',
    type: 'number',
    label: 'Mass (kg)',
    align: 'end',
    sortable: true,
  },
  {
    key: 'created',
    type: 'date',
    label: 'Created',
    align: 'start',
    sortable: true,
  }
]

let characters = $ref([])
let tableData = $ref({})
let apiStates = $ref({
  'req1': {
    loading: true,
    error: ''
  },
  'req2': {
    loading: true,
    error: ''
  },
})
const loadingStates = $computed(() => Object.values(apiStates).map(el => el.loading))
const errorMessages = computed(() => Object.values(apiStates).map(el => el.error))
const showTable = computed(() => !loadingStates.includes(true))

// get data
if (isDev) {
  setTimeout(() => tableData.headers = HEADERS, 100)
  setTimeout(() => tableData.data = createDataset(HEADERS, DEMO_CHARACTERS), 300)
  setTimeout(() => apiStates.req1.loading = false, 800)
  setTimeout(() => apiStates.req2.loading = false, 1600)
}
onBeforeMount(() => {
  if (isDev) return
  tableData.headers = HEADERS
  const urls = ['https://swapi.dev/api/people/']
  getData(urls).then(data => {
    if (data.error) {
      console.error(data.error)
      apiStates.req1.error = data.error
    } else {
      const response = data.results[0].results
      characters = response
      const planetUrls = response.map(ch => ch.homeworld)
      const uniqueUrls = [...new Set(planetUrls)]
      getData(uniqueUrls)
        .then(data => {
          if (data.error) {
            console.error(data.error)
            apiStates.req2.error = data.error
          } else {
            tableData.data = createDataset(HEADERS, characters)
          }
          apiStates.req2.loading = false
        })
    }
    apiStates.req1.loading = false
  })
})

function createDataset (headers, characters) {
  return headers.map(head => characters.map(c => c[head.key]))
}
</script>

<template>
  <div v-for="(loading, idx) in loadingStates">
    <!-- loading messages -->
    <div v-if="loading">
      loading dataset {{ idx + 1 }} of {{ loadingStates.length }}
    </div>
  </div>
  <!-- error messages -->
  <div v-for="errorMessage in errorMessages">
    <div v-if="errorMessage">
      {{ errorMessage }}
    </div>
  </div>

  <!-- show table -->
  <div v-if="showTable">
    <TableParent
      :tableData="tableData"
      :defaultSortDirection="1"
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
