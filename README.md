# Vue 3 + Vite

- https://mui.com/components/tables/

- https://mdbootstrap.com/docs/b4/jquery/tables/basic/

- https://material.io/components/data-tables#anatomy

- https://vuetifyjs.com /en/components/data-tables/

## Todo:

- scroll
  - virtualization

- url
  - share table with applied filters, pagination, sorting

- keyboard navigation

- handle/test live updates

- pagination (select rows per page or add an array with a custom range)

---

Impressions:
- https://www.massimodutti.com/de/regularfitjeanshemd-im-washedlook-l00170464 (Sizetable/Größentabelle)

- https://uxdesign.cc/data-table-for-enterprise-ux-cb48fb9fdf1e

Read:
- https://www.w3.org/TR/wai-aria-practices/examples/table/table.html

- https://en.wikipedia.org/wiki/Rank_correlation

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

---

mergeSort
- 100_000 ~200ms


---

- get idxs of headers via filter tags
- if not use default sort header by
- call a method (dataset)
- sort array
- use sorted array with filter tag
- call method binary search
- return idxs
