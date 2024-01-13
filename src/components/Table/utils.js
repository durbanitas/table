const MAX_DECIMALS = 4

// *==================================================*
// *--------- STYLE TEMPLATE VALUES ------------------*
// *==================================================*

// ------------------------------------------------
// build non-colored template string for num values
// ------------------------------------------------
const transformNum = (num) => {
  const str = num.toString()
  const [integerPart, decimalPart] = str.split('.');

  let htmlStr

  if (decimalPart === undefined) {
    htmlStr = `${integerPart}<span class="text-muted">.0000</span>`
  } else {
    const floatLen = decimalPart.length
    const zeroNums = MAX_DECIMALS - floatLen
    const zeros = '0'.repeat(zeroNums)
    if (floatLen === MAX_DECIMALS) {
      htmlStr = str
    } else {
      htmlStr = `${integerPart}.${decimalPart}<span class="text-muted">${zeros}</span>`
    }
  }

  return htmlStr
}

// ------------------------------------------------
// build colored template string for num values
// ------------------------------------------------
const getColoredTemplateString = (integerPart, decimalPart, sign='positive') => {
  if (decimalPart === undefined) {
    return `<span class="text-${sign}">${integerPart}</span><span class="text-muted-${sign}">.0000</span>`
  } else {
    const floatLen = decimalPart.length
    const zeroNums = MAX_DECIMALS - floatLen
    const zeros = '0'.repeat(zeroNums)
    return `<span class="text-${sign}">${integerPart}.${decimalPart}</span><span class="text-muted-${sign}">${zeros}</span>`
  }
}

const transformNumColored = (num) => {
  const isPos = num > 0

  const str = num.toString()
  const [integerPart, decimalPart] = str.split('.');

  if (isPos) {
    return getColoredTemplateString(integerPart, decimalPart, 'positive')
  } else {
    return getColoredTemplateString(integerPart, decimalPart, 'negative')
  }
}

// ------------------------------------------------
// make dates readable
// ------------------------------------------------
const transformDateString = (data) => {
  const dateObject = new Date(data)

  const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  const timeOptions = { hour12: true, hour: 'numeric', minute: '2-digit', seconds: '2-digit' };

  const dateDay = dateObject.toLocaleDateString('en-US', dateOptions)
  const dateHour = dateObject.toLocaleTimeString('en-US', timeOptions)

  return `${dateDay} <span class="text-muted">${dateHour}</span>`
}

// ------------------------------------------------
// highlight/emphasize characters if searching
// ------------------------------------------------
const emphasieString = (str, searchQuery) => {
  const emphasizedString = str.replace(
    new RegExp(searchQuery.replace('.', '\\.'), 'gi'),
    (match) => `<span class="text-emphasis">${match}</span>`
  )

  return emphasizedString
}

// *==================================================*
// *------- CHOOSE METHOD AND RETURN TEMPLATE STRING -*
// *==================================================*
export const transformData = (value, type, index, searchQuery, searchType) => {
  if (type === 'date') {
    return transformDateString(value)
  }
  
  if (index === 0) {
    return value
  }
  
  if (index === 3) {
    const numStr = `${transformNumColored(value)}`

    if (searchQuery.length === 0 || searchType === 'string') {
      return numStr
    }

    return emphasieString(numStr, searchQuery)
  }
  
  if (type === 'number' || index === 6) {
    const numStr = `${transformNum(value, index)}`

    if (searchQuery.length === 0 || searchType === 'string') {
      return numStr
    }

    return emphasieString(numStr, searchQuery)
  } else {
    if (searchQuery.length === 0 || searchType === 'number') return value

    return emphasieString(value, searchQuery)
  }
}
