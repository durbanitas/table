<script setup>
import Table from '../components/Table.vue'
import InputNames from '../components/InputNames.vue'
import { ref, onBeforeMount, watchEffect } from 'vue'
import { getData } from '../utils/helpers.js'
// demo data
import { DEMO_CHARACTERS, DEMO_PLANETS } from '../utils/demo_data.js'
// TODO: add macros
// import { $ref } from 'vue/macros'

// Settings
// TODO: minimize character_infos
const CHARACTER_INFOS = [
  {
    key: 'name',
    type: 'String',
    label: 'Name'
  },
  {
    key: 'height',
    type: 'Number',
    label: 'Height (cm)'
  },
  {
    key: 'mass',
    type: 'Number',
    label: 'Mass (kg)'
  },
  {
    key: 'created',
    type: 'Date',
    label: 'Created'
  },
  {
    key: 'edited',
    type: 'Date',
    label: 'Edited'
  },
  {
    key: 'homeworld',
    type: 'String',
    label: 'Homeworld'
  },
]
const PLANET_INFOS = ['name', 'diameter', 'climate', 'population', 'url']

const isDev = false
let loading = ref(true)
let characters = ref([])
let planets = ref([])
// get data
if (isDev) {
  setTimeout(() => characters.value = DEMO_CHARACTERS, 300);
  setTimeout(() => planets.value = DEMO_PLANETS, 200);
  setTimeout(() => loading.value = false, 600);
}
onBeforeMount(() => {
  if (isDev) return
  const urls = ['https://swapi.dev/api/people/']
  getData(urls).then(data => {
    characters.value = data.results[0].results
    if (!data.error) {
      const planetUrls = ['https://swapi.dev/api/planets/']
      getData(planetUrls)
        .then(data => planets.value = data.results[0].results)
        .then(() => loading.value = false)
    } else {
      console.error(data.error)
    }
  })
})
// user interaction - sorting
const sortedHeader = ref({
  key: 'height',
  type: 'Number'
}) // name, height, mass

const sortDirection = ref(1) // 1 & -1
function sort (headObj, d) {
  sortDirection.value = d
  sortedHeader.value = headObj
}
// user interaction - filters
// TODO: add filter tags
const searchName = ref('')
</script>

<template>
  <InputNames v-model="searchName" />
  <Table
    :headers="CHARACTER_INFOS"
    :tableData="characters"
    :fiterTags="[]"
    :sortedHeader="sortedHeader"
    :sortDirection="sortDirection"
    :loading="loading"
    @onHeaderSort="sort"
    :defaultSortDirection="1"
  />
</template>
