export const CHARACTER_INFOS = [
  {
    name: 'name',
    type: 'String'
  },
  {
    name: 'height',
    type: 'Number'
  },
  {
    name: 'mass',
    type: 'Number'
  },
  {
    name: 'created',
    type: 'Date'
  },
  {
    name: 'edited',
    type: 'Date'
  },
  {
    name: 'homeworld',
    type: 'String'
  },
]
const PLANET_INFOS = ['name', 'diameter', 'climate', 'population', 'url']

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

export const getCharacters = async () => {
  const URL = 'https://swapi.dev/api/people'
  const data = {
    results: [],
    error: ''
  }

  await fetch(URL).then(res => {
    return res.json()
  }).then(res => {
    data.results = res.results
  }).catch(err => {
    data.error = err.status + ' ' + err.message
  })
  return data
}

export const getPlanets = async planetUrls => {
  const p_data = {
    results: [],
    error: ''
  }

  Promise.all(planetUrls.map(url => fetch(url).then(res => res.json())
  )).then(res => {
    p_data.results = res
  }).catch(err => {
    p_data.error = err.status + ' ' + err.message
  })
  return p_data
}
