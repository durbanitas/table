const maxZeros = 4
const transformNum = (num) => {
  const str = num.toString()
  const x = str.split('.')
  let htmlStr
  if (x.length === 1) {
    htmlStr = x[0] + '<span class="text-muted">.0000</span>'
  } else {
    const floatLen = x[1].length
    const zeroNums = maxZeros - floatLen
    const zeros = '0'.repeat(zeroNums)
    if (floatLen === maxZeros) {
      htmlStr = str
    } else {
      htmlStr = x[0] + `.${x[1]}<span class="text-muted">${zeros}</span>`
    }
  }

  return htmlStr
}

const transformNumColored = (num) => {
  const isPos = num > 0
  const str = num.toString()
  const x = str.split('.')
  let htmlStr

  if (isPos) {
    if (x.length === 1) {
      htmlStr = `<span class="text-positive">${x[0]}</span><span class="text-muted-positive">.0000</span>`
    } else {
      const floatLen = x[1].length
      const zeroNums = 4 - floatLen
      const zeros = '0'.repeat(zeroNums)
      htmlStr = `<span class="text-positive">${x[0]}.${x[1]}</span><span class="text-muted-positive">${zeros}</span>`
    }
  } else {
    if (x.length === 1) {
      htmlStr = `<span class="text-negative">${x[0]}</span><span class="text-muted-negative">.0000</span>`
    } else {
      const floatLen = x[1].length
      const zeroNums = 4 - floatLen
      const zeros = '0'.repeat(zeroNums)
      htmlStr = `<span class="text-negative">${x[0]}.${x[1]}</span><span class="text-muted-negative">${zeros}</span>`
    }
  }

  return htmlStr
}

const emphasieString = (str, searchQuery) => {
  const emphasizedString = str.replace(
    new RegExp(searchQuery.replace('.', '\\.'), 'gi'),
    (match) => `<span class="text-emphasis">${match}</span>`
  )

  return emphasizedString
}

export const transformData = (data, type, index, searchQuery, searchType) => {
  if (type === 'date') {
    const dateObject = new Date(data)
    const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    const timeOptions = { hour12: true, hour: 'numeric', minute: '2-digit', seconds: '2-digit' };
    const dateDay = dateObject.toLocaleDateString('en-US', dateOptions)
    const dateHour = dateObject.toLocaleTimeString('en-US', timeOptions)

    return `${dateDay} <span class="text-muted">${dateHour}</span>`
  } else if (index === 0) {
    return new Intl.NumberFormat('en-US').format(data)
  } else if (index === 3) {
    const numStr = `${transformNumColored(data)}`

    if (searchQuery.length === 0 || searchType === 'string') {
      return numStr
    }

    return emphasieString(numStr, searchQuery)
  } else if (type === 'number' || index === 6) {
    const numStr = `${transformNum(data, index)}`

    if (searchQuery.length === 0 || searchType === 'string') {
      return numStr
    }

    return emphasieString(numStr, searchQuery)
  } else {
    if (searchQuery.length === 0 || searchType === 'number') return data

    return emphasieString(data, searchQuery)
  }
}

