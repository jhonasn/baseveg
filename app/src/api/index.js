const removeDiacritics = (text, removeSpecialChars) => {
  const newText = text.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

    // remove non alfanumeric chars too
  if (removeSpecialChars) return newText.replace(/[^A-z\d\s]/g, '')
  return newText
}

export const convertToSearchText = (text, removeSpecialChars = false) =>
  removeDiacritics(text.toLowerCase())

export function getNextItems(collection, lastId, chunkSize = 20) {
  const idx = collection.findIndex(i => i.id === lastId) + 1
  return collection.slice(idx, idx + chunkSize)
}

let data = null
export default async function getData() {
  if (data) return data
  const response = await fetch(`${process.env.PUBLIC_URL}/data.json`)
  data = await response.json()
  return data
}
