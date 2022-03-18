export const createDataset = (userColumns, userRows) => {
  const data = []
  const headers = []
  for (let i = 0; i < userColumns; i++) {
    const arr = new Array(userRows).fill(null)
    for (let idx = 0; idx < arr.length; idx++) {
      arr[idx] = createN()
    }
    data.push(arr)
    const head = {
      key: i,
      label: 'Col' + i,
      type: 'number',
      sortable: true
    }
    headers.push(head)
  }

  return { data, headers }
}

function createN () {
  return Number((Math.random() * 100).toFixed())
}
