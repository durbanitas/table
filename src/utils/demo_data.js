// Create dataset of numbers
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
      columnKey: i,
      label: 'Col' + i,
      type: 'number',
      sortable: true,
      align: 'end'
    }
    headers.push(head)
  }

  return { data, headers }
}

function createN () {
  return Number((Math.random() * 100).toFixed())
}

// dataset of star wars characters
export const demoStarWarsData = {
  headers: [
    {
      columnKey: 'name',
      type: 'string',
      label: 'Name',
      align: 'start',
      sortable: true,
    },
    {
      columnKey: 'height',
      type: 'number',
      label: 'Height',
      align: 'end',
      sortable: true,
    },
    {
      columnKey: 'created',
      type: 'date',
      label: 'Created',
      align: 'center',
      sortable: true,
    },
  ],
  data: [
    ['luke', 'yoda', 'C-3PO', 'Darth Vader'],
    [175, 65, 167, 202],
    [1418129410, 1419094570, 1419229410, 1417094570]
  ]
}
