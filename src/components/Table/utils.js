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
    htmlStr = x[0] + `.${x[1]}<span class="text-muted">${zeros}</span>`
  }
  return htmlStr
}

export const transformData = (data, type, index) => {
  if (type === 'date') {
    const dateObject = new Date(data)
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const timeOptions = { hour12: false, hour: '2-digit', minute: '2-digit', seconds: '2-digit' };
    const dateDay = dateObject.toLocaleString('us-US', dateOptions)
    const dateHour = dateObject.toLocaleTimeString('us-US', timeOptions)
    return dateDay + ' ' + dateHour
  } else if (index === 0) {
    return new Intl.NumberFormat('en-US').format(data)
  } else if (type === 'number') {
    return `${transformNum(data)}`
  } else {
    return data
  }
}