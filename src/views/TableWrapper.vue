<script setup>
import Table from '../components/Table.vue'
import InputNames from '../components/InputNames.vue'
import { ref, onBeforeMount } from 'vue'
import { getData } from '../utils/helpers.js'
// demo data
import { DEMO_CHARACTERS, DEMO_PLANETS } from '../utils/demo_data.js'

// Settings
const CHARACTER_INFOS = ref([
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
])
const PLANET_INFOS = ['name', 'diameter', 'climate', 'population', 'url']

const isDev = true
let characters = ref([])
let planets = ref([])

if (isDev) {
  setTimeout(() => {
    characters.value = DEMO_CHARACTERS
    setTimeout(() => {
      planets.value = DEMO_PLANETS
    }, 200);
  }, 300);
}

const planetTestUrls = [
  'https://swapi.dev/api/planets/1/',
  'https://swapi.dev/api/planets/2/',
  'https://swapi.dev/api/planets/4100/',
  'https://swapi.dev/api/planets/8/'
]
// response
// [
//   {
//     "name": "Tatooine",
//     // [...]
//   },
//   {
//     "name": "Alderaan",
//     // [...]
//   },
//   {
//     "detail": "Not found"
//   },
//   {
//     "name": "Naboo",
//     // [...]
//   }
// ]

onBeforeMount(() => {
  if (isDev) return
  const chararcterUrls = ['https://swapi.dev/api/people']
  getData(chararcterUrls).then(data => {
    console.log(data.results[0].results);
    characters.value = data.results[0].results
    const planetUrls = data.results[0].results.map(ch => ch.homeworld)
    const uniqueUrls = [...new Set(planetUrls)]
    if (data.results) {
      // planetTestUrls
      getData(uniqueUrls).then(res => {
        console.log(res.results);
        planets.value = res.results
      })
    }
  })
})

const count = ref(0)
const sortDirection = ref(1) // 1 & -1
const sortedHeader = ref({
  value: 'height',
  type: 'Number'
}) // name, height, mass
const searchName = ref('')
function sort (head) {
  sortDirection.value *= -1
  sortedHeader.value = head

  // FIXME: handle reactivity
  count.value++
}
</script>

<template>
  <InputNames v-model="searchName" />
  <Table
    :headers="CHARACTER_INFOS"
    :tableData="characters"
    :fiterTags="[]"
    :sortedDirection="sortDirection"
    :sortedHeader="sortedHeader"
    @onHeaderSort="sort"
    :key="count"
  />
</template>
