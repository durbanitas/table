import { ref } from 'vue'
// 
export const ROWS = ['name', 'height', 'mass', 'created', 'edited', 'homeworld']
const planetData = ['name', 'diameter', 'climate', 'population', 'url']

export const sortings = {
  up: {
    name: (char1, char2) => char2.name.toLowerCase() > char1.name.toLowerCase() ? -1 : char1.name.toLowerCase() > char2.name.toLowerCase() ? 1 : 0,
    mass: (char1, char2) => char2.mass - char1.mass,
    height: (char1, char2) => char2.height - char1.height,
    created: (char1, char2) => new Date(char2.created) - new Date(char1.created),
    edited: (char1, char2) => new Date(char2.edited) - new Date(char1.edited),
    homeworld: (char1, char2) => char2.planetName.toLowerCase() > char1.planetName.toLowerCase() ? -1 : char1.planetName.toLowerCase() > char2.planetName.toLowerCase() ? 1 : 0,
  },
  down: {
    name: (char1, char2) => char1.name.toLowerCase() > char2.name.toLowerCase() ? -1 : char2.name.toLowerCase() > char1.name.toLowerCase() ? 1 : 0,
    mass: (char1, char2) => char1.mass - char2.mass,
    height: (char1, char2) => char1.height - char2.height,
    created: (char1, char2) => new Date(char1.created) - new Date(char2.created),
    edited: (char1, char2) => new Date(char1.edited) - new Date(char2.edited),
    homeworld: (char1, char2) => char1.planetName.toLowerCase() > char2.planetName.toLowerCase() ? -1 : char2.planetName.toLowerCase() > char1.planetName.toLowerCase() ? 1 : 0,
  }
}

// handle states
// TODO: set to false
export const loadingData = ref(false)

export let CHARACTERS = []
export let PLANETS = []

export const getCharacters = () => {
  console.log('API CALL');
  const URL = 'https://swapi.dev/api/people'
  fetch(URL).then(res => {
    return res.json()
  }).then((res) => {
    CHARACTERS = trimCharacterInfos(res.results)
  })
    .catch(err => {
      // TODO: add error code
      console.log(err);
    })
    .finally(() => {
      getPlanets(CHARACTERS)
    })
}
function trimCharacterInfos (characters) {
  return characters.map(char => {
    const obj = {}
    ROWS.forEach(head => {
      Object.assign(obj, { [head]: char[head] })
      if (head === 'homeworld') {
        const planetKey = char.homeworld.match(/\/planets\/(\d+)\//)
        if (planetKey) Object.assign(obj, { key: Number(planetKey[1]) })
      }
    })
    return obj
  })
}

export const getPlanets = (CHARACTERS) => {
  // trim urls to unique set to minimize api calls
  const arr = []
  CHARACTERS.forEach(char => arr.push(char.homeworld))
  const URLS = [...new Set(arr)]
  // fetch planet data
  // TODO: add error handling
  Promise.all(URLS.map(url =>
    fetch(url).then(resp => resp.json())
  )).then(planets => {
    PLANETS = trimPlanetInfos(planets)
    addPlanetNamesToChars(PLANETS)
  }).finally(() => {
    loadingData.value = false
  })
}
function trimPlanetInfos (planets) {
  return planets.map(planet => {
    const obj = {}
    planetData.forEach(head => {
      Object.assign(obj, { [head]: planet[head] })
      if (head === 'url') {
        const planetKey = planet.url.match(/\/planets\/(\d+)\//)
        if (planetKey) Object.assign(obj, { key: Number(planetKey[1]) })
      }
    })
    return obj
  })
}
function addPlanetNamesToChars (planets) {
  CHARACTERS.forEach((char, idx) => {
    const planet = planets.filter(p => p.key === char.key)
    const planetName = planet[0].name
    Object.assign(CHARACTERS[idx], { planetName })
  })
}

export const firstCharUppercase = str => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const DEMO = [
  {
    "name": "Luke Skywalker",
    "height": "172",
    "mass": "77",
    "created": "2014-12-09T13:50:51.644000Z",
    "edited": "2014-12-20T21:17:56.891000Z",
    "homeworld": "https://swapi.dev/api/planets/1/",
    "key": 1,
    "planetName": "Tatooine"
  },
  {
    "name": "C-3PO",
    "height": "167",
    "mass": "75",
    "created": "2014-12-10T15:10:51.357000Z",
    "edited": "2014-12-20T21:17:50.309000Z",
    "homeworld": "https://swapi.dev/api/planets/1/",
    "key": 1,
    "planetName": "Tatooine"
  },
  {
    "name": "R2-D2",
    "height": "96",
    "mass": "32",
    "created": "2014-12-10T15:11:50.376000Z",
    "edited": "2014-12-20T21:17:50.311000Z",
    "homeworld": "https://swapi.dev/api/planets/8/",
    "key": 8,
    "planetName": "Naboo"
  },
  {
    "name": "Darth Vader",
    "height": "202",
    "mass": "136",
    "created": "2014-12-10T15:18:20.704000Z",
    "edited": "2014-12-20T21:17:50.313000Z",
    "homeworld": "https://swapi.dev/api/planets/1/",
    "key": 1,
    "planetName": "Tatooine"
  },
  {
    "name": "Leia Organa",
    "height": "150",
    "mass": "49",
    "created": "2014-12-10T15:20:09.791000Z",
    "edited": "2014-12-20T21:17:50.315000Z",
    "homeworld": "https://swapi.dev/api/planets/2/",
    "key": 2,
    "planetName": "Alderaan"
  },
  {
    "name": "Owen Lars",
    "height": "178",
    "mass": "120",
    "created": "2014-12-10T15:52:14.024000Z",
    "edited": "2014-12-20T21:17:50.317000Z",
    "homeworld": "https://swapi.dev/api/planets/1/",
    "key": 1,
    "planetName": "Tatooine"
  },
  {
    "name": "Beru Whitesun lars",
    "height": "165",
    "mass": "75",
    "created": "2014-12-10T15:53:41.121000Z",
    "edited": "2014-12-20T21:17:50.319000Z",
    "homeworld": "https://swapi.dev/api/planets/1/",
    "key": 1,
    "planetName": "Tatooine"
  },
  {
    "name": "R5-D4",
    "height": "97",
    "mass": "32",
    "created": "2014-12-10T15:57:50.959000Z",
    "edited": "2014-12-20T21:17:50.321000Z",
    "homeworld": "https://swapi.dev/api/planets/1/",
    "key": 1,
    "planetName": "Tatooine"
  },
  {
    "name": "Biggs Darklighter",
    "height": "183",
    "mass": "84",
    "created": "2014-12-10T15:59:50.509000Z",
    "edited": "2014-12-20T21:17:50.323000Z",
    "homeworld": "https://swapi.dev/api/planets/1/",
    "key": 1,
    "planetName": "Tatooine"
  },
  {
    "name": "Obi-Wan Kenobi",
    "height": "182",
    "mass": "77",
    "created": "2014-12-10T16:16:29.192000Z",
    "edited": "2014-12-20T21:17:50.325000Z",
    "homeworld": "https://swapi.dev/api/planets/20/",
    "key": 20,
    "planetName": "Stewjon"
  }
]
export const DEMO_PLANETS = [
  {
    "name": "Tatooine",
    "diameter": "10465",
    "climate": "arid",
    "population": "200000",
    "url": "https://swapi.dev/api/planets/1/",
    "key": 1
  },
  {
    "name": "Naboo",
    "diameter": "12120",
    "climate": "temperate",
    "population": "4500000000",
    "url": "https://swapi.dev/api/planets/8/",
    "key": 8
  },
  {
    "name": "Alderaan",
    "diameter": "12500",
    "climate": "temperate",
    "population": "2000000000",
    "url": "https://swapi.dev/api/planets/2/",
    "key": 2
  },
  {
    "name": "Stewjon",
    "diameter": "0",
    "climate": "temperate",
    "population": "unknown",
    "url": "https://swapi.dev/api/planets/20/",
    "key": 20
  }
]
