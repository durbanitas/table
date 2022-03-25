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

---

Impressions:
- https://www.massimodutti.com/de/regularfitjeanshemd-im-washedlook-l00170464 (Sizetable/Größentabelle)

- https://uxdesign.cc/data-table-for-enterprise-ux-cb48fb9fdf1e

Read:
- https://www.w3.org/TR/wai-aria-practices/examples/table/table.html

- https://en.wikipedia.org/wiki/Rank_correlation

// TODO: handle resize events
// pagination vs. scroll
// reactive rows per page / client viewheight

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

<!-- validate length of same rows over columns-->
<!-- validate matching enough headers for data arrays -->
<!-- validate same typeof each entries -->
<!-- filter by each column simpler -->

<!-- pass done entries vs. pass format method to format each entry  -->

<!-- // virtualization
// get single td height
// get visible table container height
// calculate max height: tdHeight * data.length = table height
// ^ makes the container scrollable
// calculate max visible td's
// assign a top height and display if in the current table view
// use an event listener on scroll to detect the position
// problems: always assign inline style, what happens if the scrollbar will be clicked?

// idea: fixed td elements
// will be automatically filled with the scroll position
// no overlapping cells -->

## Localhost

| Run | Filtering | Sorting | Rendering | Total | Rows | Columns |
|---|---|---|---|---|---|---|
| 1 | / | 2 | 4 | 6 | 100 | 2 |
| 2 | / | 12 | 21 | 33 | 1_000 | 2 |
| 3 | / | 63 | 140 | 203 | 10_000 | 2 |
| 4 | / | 687 | 1539 | 2226 | 100_000 | 2 |
| 5 | / | 9536 | 19835 | 29371 | 1_000_000 | 2 |

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

## Deployed

| Run | Filtering | Sorting | Rendering | Total | Rows | Columns |
|---|---|---|---|---|---|---|
| 1 | / | 3 | 11 | 14 | 100 | 10 |
| 2 | / | 10 | 43 | 53 | 1_000 | 10 |
| 3 | / | 62 | 445 | 507 | 10_000 | 10 |
| 4 | / |  |  |  | 100_000 | 10 |
| 5 | / |  |  |  | 1_000_000 | 10 |

```js
{
  "filtering": null,
  "sorting": 5.6,
  "rendering": 25.3,
  "total": 30.9,
  "rows": 1000,
  "columns": 4
}
{
  "filtering": null,
  "sorting": 48.6,
  "rendering": 207.3,
  "total": 255.9,
  "rows": 10000,
  "columns": 4
}
{
  "filtering": null,
  "sorting": 488.1,
  "rendering": 2571.6,
  "total": 3059.7,
  "rows": 100000,
  "columns": 4
}
{ // only once executed
  "filtering": null,
  "sorting": 6186,
  "rendering": 28590,
  "total": 34776,
  "rows": 1000000,
  "columns": 4
}
```

```js
{
  "filtering": null,
  "sorting": 8.3,
  "rendering": 212,
  "total": 220.3,
  "rows": 1000,
  "columns": 40
}
{
  "filtering": null,
  "sorting": 55.8,
  "rendering": 2523.1,
  "total": 2578.9,
  "rows": 10000,
  "columns": 40
}
```


---
second time
```js

{
  "filtering": null,
  "sorting": 6,
  "rendering": 46,
  "total": 52,
  "rows": 1000,
  "columns": 10
}
{
  "filtering": null,
  "sorting": 60,
  "rendering": 487,
  "total": 547,
  "rows": 10000,
  "columns": 10
}
{
  "filtering": null,
  "sorting": 513,
  "rendering": 6493,
  "total": 7006,
  "rows": 100000,
  "columns": 10
}
{
  "filtering": null,
  "sorting": 13216,
  "rendering": 88696,
  "total": 101912,
  "rows": 1000000,
  "columns": 10
}
```
