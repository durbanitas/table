<script setup>
import Table from '../components/Table.vue'
import InputNames from '../components/InputNames.vue'
import { ref, onBeforeMount } from 'vue'
import { getData } from '../utils/helpers.js'
// demo data
import { DEMO_CHARACTERS, DEMO_PLANETS } from '../utils/demo_data.js'
// TODO: all macros
// import { $ref } from 'vue/macros'

// Settings
// TODO: minimize character_infos
const CHARACTER_INFOS = [
  {
    value: 'name',
    type: 'String',
    name: 'Name'
  },
  {
    value: 'height',
    type: 'Number',
    name: 'Height (cm)'
  },
  {
    value: 'mass',
    type: 'Number',
    name: 'Mass (kg)'
  },
  {
    value: 'created',
    type: 'Date',
    name: 'Created'
  },
  {
    value: 'edited',
    type: 'Date',
    name: 'Edited'
  },
  {
    value: 'homeworld',
    type: 'String',
    name: 'Homeworld'
  },
]
const PLANET_INFOS = ['name', 'diameter', 'climate', 'population', 'url']

const isDev = true
let loading = ref(true)
let characters = ref([])
let planets = ref([])

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
    }
  })
})

const sortedHeader = ref({
  value: 'height',
  type: 'Number'
}) // name, height, mass
// TODO: add filter tags
const searchName = ref('')

const sortDirection = ref(1) // 1 & -1
function sort (headObj, d) {
  sortDirection.value = d
  sortedHeader.value = headObj
}

</script>

<template>
  <InputNames v-model="searchName" />
  <Table
    :headers="CHARACTER_INFOS"
    :tableData="characters"
    :fiterTags="[]"
    :sortedHeader="sortedHeader"
    :sortDirection="sortDirection"
    :defaultSortDirection="1"
    :loading="loading"
    @onHeaderSort="sort"
  />
</template>
