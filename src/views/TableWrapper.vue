<script setup>
import Table from '../components/Table.vue'
import InputNames from '../components/InputNames.vue'
import { ref, onBeforeMount } from 'vue'
import { CHARACTER_INFOS, getCharacters, getPlanets } from '../utils/helpers.js'
// demo data
import { DEMO_CHARACTERS, DEMO_PLANETS } from '../utils/demo_data.js'

const isDev = true
let characters = ref([])
let planets = ref([])

onBeforeMount(() => {
  if (isDev) {
    setTimeout(() => {
      characters.value = DEMO_CHARACTERS
      setTimeout(() => {
        planets.value = DEMO_PLANETS
      }, 200);
    }, 100);
  } else {
    getCharacters().then(data => {
      characters.value = data.results
      const planetUrls = data.results.map(ch => ch.homeworld)
      const uniqueUrls = [...new Set(planetUrls)]
      if (data.results) {
        getPlanets(uniqueUrls).then(res => {
          setTimeout(() => {
            console.log(res.results);
          }, 100);
          planets.value = res.results
        })
      }
    })
  }
})
</script>

<template>
  <InputNames v-model="searchName" />
  <Table
    :titles="CHARACTER_INFOS"
    :content="characters"
    :searchName="'lu'"
  />
</template>


<style lang="scss" scoped>
</style>
