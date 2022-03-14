# Vue 3 + Vite

- https://mui.com/components/tables/

- https://mdbootstrap.com/docs/b4/jquery/tables/basic/

- https://material.io/components/data-tables#anatomy

- https://vuetifyjs.com/en/components/data-tables/

## Todo:

- scroll
  - virtualization

- url
  - share table with applied filters, pagination, sorting

---

Impressions:
- https://www.massimodutti.com/de/regularfitjeanshemd-im-washedlook-l00170464 (Sizetable/Größentabelle)

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
