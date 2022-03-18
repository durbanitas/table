// TODO: test for strings & dates
// TODO: test for filters
// TODO: expectations? rendering tooks long...
// TODO: test in production

export const getSums = (arr) => {
  const len = arr.length
  const obj = {
    filtering: null,
    sorting: null,
    rendering: null,
    total: null
  }
  arr.forEach(test => {
    test.forEach((val, i) => {
      if (i === 0) obj.filtering += val
      if (i === 1) obj.sorting += val
      if (i === 2) obj.rendering += val
      if (val) obj.total += val
    })
  })
  Object.keys(obj).forEach(key => obj[key] = obj[key] / len)
  return obj
}
// { filtering: ms, sorting: ms, rendering ms, columns: x, rows: y, columnDataType: 'numeric', overall: filtering + sorting + rendering }
