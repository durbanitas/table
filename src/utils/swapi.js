// get all films
export const getFilms = async () => {
  const URL = 'https://swapi.dev/api/films/'
  let filmsData = {}
  const obj = {
    results: [],
    error: ''
  }
  filmsData = await fetch(URL)
    .then(data => data.json())
    .catch(err => obj.error = err.message)

  obj.results = filmsData.results
  return obj
}

// get single character
export const getSingleCharacter = num => {
  const URL = 'https://swapi.dev/api/people/'
  const obj = {
    data: {},
    error: ''
  }
  fetch(URL + num + '/')
    .then(data => data.json())
    .then(res => obj.data = res)
    .catch(err => obj.error = err.message)
  return obj
}
