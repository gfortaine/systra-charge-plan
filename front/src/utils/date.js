export function stringToDate (dateString, language) {
  let d, m, y
  switch (language) {
    case 'en':
      [m, d, y] = dateString.split('/')
      break
    case 'fr':
    default:
      [d, m, y] = dateString.split('/')
      break
  }
  return new Date(y, m, d)
}

export function getRandomDate (start, end) {
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime())
  const randomDate = new Date(randomTime)
  return randomDate
}
