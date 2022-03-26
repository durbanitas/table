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
      key: i,
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
      key: 'name',
      type: 'string',
      label: 'Name',
      align: 'start',
      sortable: true,
    },
    {
      key: 'height',
      type: 'number',
      label: 'Height',
      align: 'end',
      sortable: true,
    },
    {
      key: 'created',
      type: 'date',
      label: 'Created',
      align: 'center',
      sortable: true,
    },
  ],
  data: [
    ['luke', 'yoda', 'C-3PO', 'Darth Vader'],
    [175, 65, 167, 202],
    ['2014-12-09T13:50:51.644000Z', '2014-12-20T21:17:56.891000Z', '2014-12-10T15:10:51.357000Z', '2014-12-10T15:18:20.704000Z']
  ]
}
