# Vue 3 + Vite

Custom table component optimized for performance.
Current benchmark to filter, sort and render  ROWS x Cols in MS.

## ideas

- create .json file w/ static data
- user can choose the length of the dataset...

- table head
  - filter
  - searchbar
  - button group: Virtal || Pagination
  - button group: add zeros / hide zeros


- cell:
  - format dates (Sep 1st, Oct 15th)
  - stage: (with colored icons)
    - demo scheduled (grey)
    - in trial (blue)
    - demo completed (orange)
    - invoice send (white)
    - trial expired (red)
  - Name Avatar (Img or Initials)
  - email-adress

- left column -> about text
- right colum -> table component

- virtual scroll
  - add longest strings in dead spacer to set cell width?

## Todo:

- add type: urls?

- handle/test live updates
  - user selection: rowsPerPage, columns, update frequency

- pagination
  - pass custom rows per page via array

- prop-validation
  - fully reusable?
  - json scheme?

- table states
  - loading?

- table styling
  -> renderless component?!
  - text overflow in cell? hover or tip show the cell expanded with the full text
  - table dividers (on/off)
  - table striped (on/off)
  - table hierachies of sticky elements
  - Table loading states (placeholder animated elements) 
  - hover cross effect. Highlight row + col
  - sort indicator (always visible -> bcs a sorted col can be outside the view)

- readable date
  - pass function via props?

- scroll
  - virtualization (important for -> show rows per page: All)

  - https://dev.to/adamklein/build-your-own-virtual-scroll-part-i-11ib


- url, add queries
  - share table with applied filters, pagination, sorting

- keyboard navigation

- renderless component

## Dependencies

- [Blueprint Colors and Icons](https://blueprintjs.com/docs/)

## Links

- https://material.io/components/data-tables#anatomy

- https://mui.com/components/tables/

- https://mdbootstrap.com/docs/b4/jquery/tables/basic/

- https://vuetifyjs.com/en/components/data-tables/

Impressions:

- https://www.massimodutti.com/de/regularfitjeanshemd-im-washedlook-l00170464 (Sizetable/Größentabelle)

- https://uxdesign.cc/data-table-for-enterprise-ux-cb48fb9fdf1e

- https://grafana.com/docs/grafana/latest/visualizations/table/

Read:

- https://www.w3.org/TR/wai-aria-practices/examples/table/table.html

- https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics

- https://en.wikipedia.org/wiki/Rank_correlation

- https://academy.datawrapper.de/article/196-customizing-your-table

---

```js
const tableData = {
  data: [ // column based
    ['luke', 'yoda', 'leia'],
    [172, 45, 162],
    [85, 45, 52],
    ['Date1', 'Date2', 'Date3']
  ],
  headers: [
    { key: 'name' },
    { key: 'height' },
    { key: 'mass' },
    { key: 'created' }
  ]
}
```
```js
const tableData = {
  data: [ // row based
    ['luke', 172, 85, 'Date1'],
    ['yoda', 45, 45, 'Date2'],
    ['leia', 162, 52, 'Date3']
  ],
  headers: [
    { key: 'name' },
    { key: 'height' },
    { key: 'mass' },
    { key: 'created' },
  ]
}
```

# Performance Tests

## Localhost (ohne filter)

| Run | Filtering | Sorting | Rendering | Total | Rows | Columns |
|---|---|---|---|---|---|---|
| 1 | / | 2 | 4 | 6 | 100 | 2 |
| 2 | / | 12 | 21 | 33 | 1_000 | 2 |
| 3 | / | 63 | 140 | 203 | 10_000 | 2 |
| 4 | / | 687 | 1539 | 2226 | 100_000 | 2 |
| 5 | / | 9536 | 19835 | 29371 | 1_000_000 | 2 |
| 5 | / | 124175 | 222905 | 347080 | 10_000_000 | 2 |

| Run | Filtering | Sorting | Rendering | Total | Rows | Columns |
|---|---|---|---|---|---|---|
| 1 | / | 1 | 13 | 14 | 100 | 10 |
| 2 | / | 12 | 87 | 99 | 1_000 | 10 |
| 3 | / | 55 | 616 | 671 | 10_000 | 10 |
| 4 | / | 673 | 6043 | 6716 | 100_000 | 10 |
| 5 | / | 17022 | 100949 | 117971 | 1_000_000 | 10 |

| Run | Filtering | Sorting | Rendering | Total | Rows | Columns |
|---|---|---|---|---|---|---|
| 1 | / | 1 | 15 | 16 | 100 | 20 |
| 2 | / | 20 | 307 | 327 | 1_000 | 20 |
| 3 | / | 68 | 1376 | 1444 | 10_000 | 20 |
| 4 | / | 976 | 24264 | 25240 | 100_000 | 20 |
| 5 | / | 16625 | 198881 | 215506 | 1_000_000 | 20 |

## Localhost (mit 1x filter)

| Run | Filtering | Sorting | Rendering | Total | Rows | Columns |
|---|---|---|---|---|---|---|
| 1 | 3 | 4 | 6 | 13 | 100 | 2 |
| 2 | 8 | 13 | 19 | 40 | 1_000 | 2 |
| 3 | 49 | 67 | 102 | 218 | 10_000 | 2 |
| 4 | 545 | 733 | 1197 | 2475 | 100_000 | 2 |
| 5 | 6051 | 9002 | 13452 | 28505 | 1_000_000 | 2 |

## Localhost (mit 5x filter)

| Run | Filtering | Sorting | Rendering | Total | Rows | Columns |
|---|---|---|---|---|---|---|
| 1 | 6 | 6 | 8 | 20 | 100 | 10 |
| 2 | 26 | 29 | 40 | 95 | 1_000 | 10 |
| 3 | 226 | 236 | 342 | 804 | 10_000 | 10 |
| 4 | 2479 | 2574 | 3886 | 8939 | 100_000 | 10 |
| 5 | 28747 | 29758 | 44056 | 102561 | 1_000_000 | 10 |

## Localhost (mit 10x filter)

| Run | Filtering | Sorting | Rendering | Total | Rows | Columns |
|---|---|---|---|---|---|---|
| 1 | 12 | 14 | 20 | 46 | 100 | 10 |
| 2 | 39 | 41 | 80 | 160 | 1_000 | 10 |
| 3 | 460 | 488 | 901 | 1849 | 10_000 | 10 |
| 4 | 4659 | 4941 | 9532 | 19132 | 100_000 | 10 |
| 5 | / | / | / | / | 1_000_000 | 10 |

## Deployed

| Run | Filtering | Sorting | Rendering | Total | Rows | Columns |
|---|---|---|---|---|---|---|
| 1 | / | 3 | 11 | 14 | 100 | 10 |
| 2 | / | 10 | 43 | 53 | 1_000 | 10 |
| 3 | / | 62 | 445 | 507 | 10_000 | 10 |
| 4 | / | 696 | 5138 | 5834 | 100_000 | 10 |
| 5 | / | 9287 | 71687 | 80974 | 1_000_000 | 10 |

## Deployed (mit 5x filter)

| Run | Filtering | Sorting | Rendering | Total | Rows | Columns |
|---|---|---|---|---|---|---|
| 1 | 5 | 7 | 8 | 20 | 100 | 10 |
| 2 | 25 | 27 | 36 | 88 | 1_000 | 10 |
| 3 | 184 | 197 | 275 | 656 | 10_000 | 10 |
| 4 | 2167 | 2278 | 3184 | 7629 | 100_000 | 10 |
| 5 | 26115 | 28235 | 39764 | 94114 | 1_000_000 | 10 |

---

# Performance Tests v2

## Localhost (ohne filter)

| Run | Filtering | Sorting | Rendering | Total | Rows | Columns |
|---|---|---|---|---|---|---|
| 1 | / | 3 | 3 | 6 | 100 | 2 |
| 2 | / | 5 | 6 | 11 | 1_000 | 2 |
| 3 | / | 29 | 32 | 61 | 10_000 | 2 |
| 4 | / | 307 | 315 | 622 | 100_000 | 2 |
| 5 | / | 3884 | 3958 | 7842 | 1_000_000 | 2 |
| 5 | / | 53199 | 53928 | 107127 | 10_000_000 | 2 |

| Run | Filtering | Sorting | Rendering | Total | Rows | Columns |
|---|---|---|---|---|---|---|
| 1 | / | 1 | 1 | 2 | 100 | 10 |
| 2 | / | 6 | 6 | 12 | 1_000 | 10 |
| 3 | / | 33 | 34 | 67 | 10_000 | 10 |
| 4 | / | 408 | 414 | 822 | 100_000 | 10 |
| 5 | / | 5967 | 6070 | 12037 | 1_000_000 | 10 |

## Localhost (mit 1x filter)

| Run | Filtering | Sorting | Rendering | Total | Rows | Columns |
|---|---|---|---|---|---|---|
| 1 | 2 | 2 | 2 | 6 | 100 | 2 |
| 2 | 8 | 10 | 10 | 28 | 1_000 | 2 |
| 3 | 60 | 74 | 75 | 209 | 10_000 | 2 |
| 4 | 587 | 728 | 734 | 2049 | 100_000 | 2 |

## Localhost (mit 5x filter)

| Run | Filtering | Sorting | Rendering | Total | Rows | Columns |
|---|---|---|---|---|---|---|
| 1 | 7 | 8 | 8 | 23 | 100 | 10 |
| 2 | 25 | 28 | 29 | 82 | 1_000 | 10 |
| 3 | 229 | 246 | 247 | 722 | 10_000 | 10 |
| 4 | 2819 | 3013 | 3020 | 8852 | 100_000 | 10 |
| 5 | 24782 | 26917 | 26982 | 78681 | 1_000_000 | 10 |

# Performance Tests v3

## Localhost (mit 3x filter)

| Run | Filtering | Sorting | Rendering | Total | Rows | Columns |
|---|---|---|---|---|---|---|
| 1 | 242 | 245 | 246 | 733 | 1_000 | 5 |

# Performance Tests v4

## Localhost (mit 5x filter)

| Run | Filtering | Sorting | Rendering | Total | Rows | Columns |
|---|---|---|---|---|---|---|
| 1 | 3 | 3 | 3 | 9 | 100 | 5 |
| 2 | 8 | 9 | 9 | 26 | 1_000 | 5 |
| 3 | 91 | 92 | 92 | 275 | 10_000 | 5 |
| 4 | 2120 | 2132 | 2132 | 6384 | 100_000 | 5 |

# Performance Tests v5

## Localhost (mit 5x filter)

| Run | Filtering | Sorting | Rendering | Total | Rows | Columns |
|---|---|---|---|---|---|---|
| 1 | 1 | 1 | 1 | 3 | 100 | 5 |
| 2 | 5 | 5 | 5 | 15 | 1_000 | 5 |
| 3 | 59 | 62 | 63 | 184 | 10_000 | 5 |
| 4 | 1430 | 650.4 | 651 | 2731.4 | 100_000 | 5 |
| 5 | 99929 | 100056 | 100057 | 300042 | 1_000_000 | 5 |

# Performance Tests v6

## Localhost (1x filter)

| Run | Filtering | Sorting | Rendering | Total | Rows | Columns |
| 1 | 161 | 229 | 241 | 631 | 100_000 | 20 |

---

mergeSort
- 100_000 ~200ms

---

```js
const y = (x) => x === 42
const testFn = new Function('x', 'y',
  'return y(x)'
);
console.log(testFn(42, y));
```

---

```
An error occurred in hook 'editComponentState' with payload: 
app: Object { _uid: 0, _component: {…}, version: "3.2.31", … }
​componentInstance: Object { uid: 8, vnode: {…}, type: {…}, … }
​path: Array [ "itemRefs", "2" ]
​set: function set(object, path, value, cb)​
state: Object { value: undefined, newKey: undefined, remove: true }
```



SEARCH Quokka.js
```
const headers = [{"columnKey":0,"charLen":0,"label":"ID","type":"number","sortable":true,"align":"end"},{"columnKey":1,"charLen":0,"label":"Name","type":"string","sortable":true,"align":"start"},{"columnKey":2,"charLen":0,"label":"Created","type":"date","sortable":true,"align":"start"},{"columnKey":3,"charLen":0,"label":"Score","type":"number","sortable":true,"align":"end"},{"columnKey":4,"charLen":0,"label":"ISO Code","type":"string","sortable":true,"align":"start"},{"columnKey":5,"charLen":0,"label":"Region","type":"string","sortable":true,"align":"start"},{"columnKey":6,"charLen":0,"label":"Num 1","type":"number","sortable":true,"align":"end"},{"columnKey":7,"charLen":0,"label":"Num 2","type":"number","sortable":true,"align":"end"}]
const data = [[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],["Jerry Cochran","Isaac Avery","Brianna Blackwell","Bell Sawyer","Uriel Mitchell","Nadine Estrada","Randall Parrish","Palmer Mckenzie","Ivory Bradley","Jason Lancaster","Slade Middleton","Slade Mcclure","Mikayla Weaver","Jescie Chang","Bradley Madden","Yvonne Morris","Caesar Rosa","Carson Warner","Arthur Byers","Britanney Mcmillan"],[402382922396,744915092234,554849747837,1262738393359,363986680261,224928946303,1039352552622,1485401608403,1207187656709,948829960427,120712811978,931524071451,731503963608,1261376201999,1322982574863,1445956661840,1151807624459,1024933124827,674849065040,1565658438248],[73.8604,45.4756,53.2585,41.0732,73.134,17.9769,35.4128,-55.8468,62.082,35.3017,66.1707,-76.9547,87.2734,-17.3169,80.1041,40.7008,-47.9934,-49.007,99.225,10.3356],["SJ","AL","RW","DK","CK","GU","VN","RW","DE","GR","BJ","NF","CN","CK","AE","AW","LV","TJ","CM","NU"],["Basilicata","Mecklenburg-Vorpommern","West-Vlaanderen","Gangwon","Pennsylvania","Niger","Calabria","Oyo","Tomsk Oblast","Arkansas","Sicilia","West Region","Jönköpings län","Valparaíso","Andhra Pradesh","Vestfold og Telemark","Cajamarca","Central Luzon","Atacama","Zaporizhzhia oblast"],["60.8333","69.2870","-15.9504","60.7479","66.1376","-124.0868","-135.2563","80.1142","163.5784","-18.7245","-1.5773","-46.5354","-141.4133","21.6081","-137.0142","-29.9688","117.5373","158.8561","-100.7679","166.7323"],[35.339,26.05,77.7335,23.12,48.06,90.4,71.604,40.9441,66.4,88.3,1.504,15.4,35,49.16,52.5546,60.0613,97.579,59.612,54,29.602]]

// get col idxs
const colIdxs = []
for (let i = 0; i < headers.length; i++) {
  if (headers[i].type === 'number') colIdxs.push(i)
}
colIdxs


const searchQuery = '.9441'
// return matching row idxs
const idxs = []

const isNumber = !isNaN(searchQuery);

if (isNumber) {
  const isFloat = isNumber && searchQuery.includes('.');
  isFloat
  const x = isFloat && searchQuery[0] === '.' ? searchQuery.split('.')[1] : searchQuery
  x
  let searchValue = Number(x)

  let remainingIdxs = []
  
  colIdxs.forEach((colIdx, idx) => {
    // get over first array and get matching idxs
    if (idx === 0) {
      data[colIdx].forEach((val, rowIdx) => {
        const gotMatch = checkForNumMatch(val, searchValue)
        gotMatch
        if (gotMatch) {
          idxs.push(rowIdx)
        } else {
          remainingIdxs.push(rowIdx)
        }
      })
    } else {
      remainingIdxs.forEach(rowIdx => {
        const val = data[colIdx][rowIdx]
        const gotMatch = checkForNumMatch(val, searchValue)
        if (gotMatch) {
          idxs.push(rowIdx)
        } 
      })
      // remainingIdxs = []
    }
  })
  
} else {
  // string
  const searchValue = searchQuery
  let remainingIdxs = []
  
  colIdxs.forEach((colIdx, idx) => {
    colIdx
    // get over first array and get matching idxs
    if (idx === 0) {
      data[colIdx].forEach((val, rowIdx) => {
        const gotMatch = checkForMatch(val, searchValue)
        if (gotMatch) {
          idxs.push(rowIdx)
        } else {
          remainingIdxs.push(rowIdx)
        }
      })
    } else {
      colIdx
      remainingIdxs.forEach(rowIdx => {
        const val = data[colIdx][rowIdx]
        console.log(val);
        const gotMatch = checkForMatch(val, searchValue)
        gotMatch
        if (gotMatch) {
          idxs.push(rowIdx)
        } else {
          // remainingIdxs.push(rowIdx)
        }
      })
      // remainingIdxs = []
    }
  })


}

idxs
// [1,2,5,6]

function checkForNumMatch(val, query, type) {
  const currentVal = val.toString()
  if (currentVal === '-129.7376') {
    val
  }
  console.log(val);
  console.log(query.toString());
  return currentVal.includes(query.toString())
}
function checkForStrMatch(val, query, type) {
  const currentVal = val.toLowerCase()
  return currentVal.includes(query.toString())
}
```