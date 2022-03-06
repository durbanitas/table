<script setup>
import TableParent from '../components/Table/TableParent.vue'
import { onBeforeMount } from 'vue'
import { getData } from '../utils/helpers.js'
// demo data
import { DEMO_CHARACTERS, DEMO_PLANETS } from '../utils/demo_data.js'

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
  // {
  //   key: 'homeworld',
  //   type: 'String',
  //   label: 'Homeworld'
  // },
]

const isDev = true
let loading = $ref(true)
let characters = $ref([])

// get data
if (isDev) {
  setTimeout(() => characters = DEMO_CHARACTERS, 200)
  setTimeout(() => mergeCharacterHomeworlds(DEMO_PLANETS), 300)
  setTimeout(() => loading = false, 1000)
}
onBeforeMount(() => {
  if (isDev) return
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
            mergeCharacterHomeworlds(data.results)
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
// replace the url with a dataset planet
function mergeCharacterHomeworlds(homeworlds) {
 characters.forEach(char => char.homeworld = homeworlds.filter(hw => hw.url === char.homeworld)[0])
}
</script>

<template>
<div v-if="loading" class="align-center table-size">
  loading table
</div>
<div v-else>
  <TableParent
    :headers="CHARACTER_INFOS"
    :tableData="characters"
    :defaultSortDirection="-1"
    :sortingLowerUpperCase="true"
  />
  <!-- optional -->
  <!-- :defaultSortDirection="-1" -->
  <!-- :sortingLowerUpperCase="true" -->
  <!-- defaultSortByHeader -->
</div>
</template>

<style>
.table-size {
  height: 400px;
  border: 1px solid #ccc;
}
</style>
