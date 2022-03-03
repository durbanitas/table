<script setup>
import { useRoute } from 'vue-router'
import { computed, ref, reactive, onMounted, watch } from 'vue'
import { loadingData, DEMO, DEMO_PLANETS, CHARACTERS, PLANETS, ROWS, sortings, firstCharUppercase } from '../utils/helpers.js'
import InputNames from '../components/InputNames.vue'
import PopupPlanet from '../components/PopupPlanet.vue'
// http://localhost:3000/table?q=Luke+Sky&key=mass&sort=up
// react to url queries
const route = useRoute();
onMounted(() => {
  console.log(route.query);
  if (route.query) {
    const { q, key, sort } = route.query
    searchName.value = q
    sortField.value = key
    sortDirection.value = sort
  }
})
// sorting
const sortDirection = ref('down') // up or down
const sortField = ref('name') // name, height, mass
const searchName = ref('')

function sort (field) {
  const direction = sortDirection.value === 'up' ? 'down' : 'up'
  sortDirection.value = direction
  sortField.value = field
  // manipulate url to make the table shareable
  history.replaceState({ urlPath: '/table' }, '', '?q=' + searchName.value + '&key=' + field + '&sort=' + direction)
}
// manipulate url
watch(searchName, (_, newVal) => {
  if (newVal.length) {
    history.replaceState({ urlPath: '/table' }, '', '?q=' + searchName.value + '&key=' + sortField.value + '&sort=' + sortDirection.value)
  }
})

// filtered results
const filteredCharacters = computed(() => {
  return DEMO.filter(char => {
    const q = searchName.value.toLowerCase()
    if (char.name.toLowerCase().includes(q)) {
      return ROWS.map(head => char[head])
    }
  }).sort(sortings[sortDirection.value][sortField.value])
})

function transformDate (date) {
  return new Date(date).toLocaleDateString('en-US')
}

// popup interaction
const showPlanets = reactive([])
onMounted(() => {
  DEMO.forEach(_ => showPlanets.push(false))
})
function showPlanet (idx) {
  // close last open planet
  const openIdx = showPlanets.indexOf(true)
  if (openIdx > -1) {
    showPlanets[openIdx] = false
  } else {
    showPlanets[idx] = true
  }
}
function planetInfo (key) {
  return DEMO_PLANETS.filter(p => p.key === key)[0]
}

// TODO: name left top over the names

// TODO:
// table: height (cm) mass (kg) 
// table: align number values right
// edited (x- months/years ago)

</script>

<template>
  <h1>Star Wars Characters</h1>
  <div class="text-center">
    <InputNames v-model="searchName" />
  </div>
  <div class="h-scroll">
    <table class="shadow">
      <thead>
        <tr>
          <th
            v-for="(head, idx) in ROWS"
            :key="head.id"
          >
            <!-- :class="{'sticky-left' : idx === 0 }" -->
            <div
              class="space-between"
              @click="sort(head)"
            >
              <div v-if="head === 'mass'">{{ firstCharUppercase(head) }} (kg)</div>
              <div v-else-if="head === 'height'">{{ firstCharUppercase(head) }} (cm)</div>
              <div v-else>{{ firstCharUppercase(head) }}</div>
              <div class="pl-6">
                <div
                  class="up-arrow"
                  :class="{ 'active-up': head === sortField && sortDirection === 'up' }"
                />
                <div
                  class="down-arrow"
                  :class="{ 'active-down': head === sortField && sortDirection === 'down' }"
                />
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody v-if="!loadingData">
        <template v-if="filteredCharacters.length">
          <tr
            v-for="(n, i) in filteredCharacters"
            :key="n.id"
          >
            <td
              v-for="(head, idx) in ROWS"
              :class="[
                {'sticky-left' : idx === 0 }, 
                {'text-right': head === 'height' || head === 'mass' }
              ]"
            >
              <span v-if="head === 'created' || head === 'edited'">
                {{ transformDate(n.created) }}
              </span>
              <span
                v-else-if="head === 'homeworld'"
                @click="showPlanet(i)"
                class="pointer text-underline"
              >
                {{ n.planetName }}
              </span>
              <span v-else>
                {{ n[head] }}
              </span>

              <PopupPlanet
                v-if="head === 'homeworld' && showPlanets.length"
                :key="n.id"
                :show="showPlanets[i]"
                :planetInfo="planetInfo(n.key)"
                :idx="i"
                @close="showPlanet"
              />
            </td>
          </tr>
        </template>
        <tr v-else>
          <td
            colspan="6"
            class="text-center"
            v-text="'No results'"
          />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
// table
table {
  width: 100%;
  border: 1px solid #ccc;
  border-spacing: 0px;
  padding: 6px;
  position: relative;
  background-color: #fff;
  border-radius: 6px;
  th {
    background: #ccc;
    position: sticky;
    top: 0;
    z-index: 2;
    user-select: none;
    cursor: pointer;
    padding: 8px 12px 8px 12px;
  }
  td {
    border: 1px solid #f1f1f1;
    // background-color: #fff;
    padding: 8px 12px 8px 12px;
    text-align: left;
  }
  tr:nth-child(even) {
    background-color: #f1f1f1;
  }
}
.sticky-left {
  left: 0;
  z-index: 3;
}
.text-right {
  text-align: right;
}

// sortings
.up-arrow {
  width: 0;
  height: 0;
  border: solid 5px transparent;
  background: transparent;
  border-bottom: solid 7px #999;
  border-top-width: 0;
  cursor: pointer;
}
.down-arrow {
  width: 0;
  height: 0;
  border: solid 5px transparent;
  background: transparent;
  border-top: solid 7px #999;
  border-bottom-width: 0;
  margin-top: 1px;
  cursor: pointer;
}
.active-up {
  border-bottom: solid 7px red;
}
.active-down {
  border-top: solid 7px red;
}

// popup
</style>
