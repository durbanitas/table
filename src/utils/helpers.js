// TODO: resolve single api call error
export const getData = async urls => {
  const data = {
    results: [],
    error: ''
  }

  await Promise.all(
    urls.map(url => fetch(url).then(res => res.json())
    )).then(res => {
      data.results = res
    }).catch(err => {
      data.error = err.status + ' ' + err.message
    })
  return data
}
