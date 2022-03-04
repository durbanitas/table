export const getData = async urls => {

  const promises = urls.map(url => fetch(url).then(res => res.json()))

  const data = {
    results: [],
    error: ''
  }
  await Promise.all(promises)
    .then(res => data.results = res)
    .catch(err => data.error = err.message)

  return data
  // use Promise.allSettled for multiple async API calls that are not dependent on each other
}
