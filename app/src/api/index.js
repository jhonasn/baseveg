const removeDiacritics = (text, removeSpecialChars) => {
  const newText = text.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

    // remove non alfanumeric chars too
  if (removeSpecialChars) return newText.replace(/[^A-z\d\s]/g, '')
  return newText
}

export const convertToSeachText = (text, removeSpecialChars = false) =>
  removeDiacritics(text.toLowerCase())

export function getNextItems(collection, lastId, chunkSize = 20) {
  const idx = collection.findIndex(i => i.id === lastId) + 1
  return collection.slice(idx, idx + chunkSize)
}

export default async function getData() {
  const response = await fetch(`${process.env.PUBLIC_URL}/data.json`)
  return await response.json()
}
