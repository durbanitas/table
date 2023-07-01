export const transformData = (data, type) => {
  if (type === 'date') {
    const dateObject = new Date(data)
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const timeOptions = { hour12: false, hour: '2-digit', minute: '2-digit', seconds: '2-digit' };
    const dateDay = dateObject.toLocaleString('us-US', dateOptions)
    const dateHour = dateObject.toLocaleTimeString('us-US', timeOptions)
    return dateDay + ' ' + dateHour
  } else {
    return data
  }
}