# Vue 3 + Vite

Custom table component optimized for performance.
Current benchmark to filter, sort and render  ROWS x Cols in MS.

## fixme:

- no results centered

- css classes / remove unused divs

- organize template nestedness

## ideas

- create .json file w/ static data
- user can choose the length of the dataset...

- table head
  - filter
  - searchbar
  - button group: Virtal || Pagination
  - button group: add zeros / hide zeros

## Todo:

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


  - https://github.com/quasarframework/quasar/blob/dev/ui/src/components/table/QTable.js


- url, add queries
  - share table with applied filters, pagination, sorting

- keyboard navigation

- renderless component
