```js
const y = ([x, a, b]) => x === b && x < a
const testFn = new Function('[...x]', 'y', 
  'return y([...x])'
);
console.log(testFn([42, 201, 42], y)); // true
```

```js
const filterTags = [
  { value: 42, operator: '==' },
  { value: 201, operator: '<' },
  { value: 41, operator: '>' }
]

const checkMatch = (dp, filters) => {
  let isMatch = true
  filters.forEach(filter => {
    if (!isMatch) return
    switch (filter.operator) {
      case '==':
        if (dp != filter.value) isMatch = false      
        break;
      case '<':
        if (dp > filter.value) isMatch = false
        break;
      case '>':
        if (dp < filter.value) isMatch = false
        break;
    }
  })
  return isMatch
}

console.log(checkMatch(42, filterTags)); // true
```

```js
const data = [
  [67, 87, 97, 13, 27, 80, 13, 19, 13, 9],
  [16, 77, 69, 390, 83, 80, 80, 307, 400, 59],
  ['ab', 'vx', 'jccha', 'km', 'log', 'cd', 'cx', 'uz', 'pl', 're']
]
const filters = [
  {
    operator: '<',
    value: 12
  },
  {
    operator: '===',
    value: 19
  },
  {
    operator: '<',
    value: 200
  }
]
const fIdxs = { 0: [0, 1], 1: [2] }

function gIdxs () {
  let idxs = []
  const filtersLen = Object.entries(fIdxs).length
  Object.entries(fIdxs).forEach((el, idx) => {
    const colIdx = el[0]
    const fis = el[1].map(f => filters[f])
    if (idx === 0) {
      idxs = getColFilteredIdxs(data[colIdx], fis, 'number')
    } else {
      for (let i = colIdx; i < filtersLen; i++) {
        const filtered = idxs.map(idx => data[colIdx][idx])
        const matchingIdxs = getColFilteredIdxs(filtered, fis, 'number')
        idxs = idxs.filter((_, idx) => {
          return matchingIdxs.indexOf(idx) !== -1
        })
      }
    }
    // if (idx === filtersLen) return idxs
  })
  return idxs
}


function getColFilteredIdxs (colData, filters, type) {
  const arr = []
  colData.forEach((el, idx) => {
    const matches = filters.map(f => {
      switch (type) {
        case 'number':
          const filterNumber = Function('f', 'value',
            `return ${f.value} ${f.operator} value`)
          return filterNumber(f, el)
        case 'string':
          return el.includes(f.value)
      }
    })
    if (!matches.includes(false)) arr.push(idx)
  });
  return arr
}

console.log(gIdxs()); // [ 7 ]
```
