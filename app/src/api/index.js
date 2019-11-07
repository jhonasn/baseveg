import data from '../data.json'

export const categories = data.categories.map(({ key, name, parent }) => ({
  key, name, parent
}))

const items = data.categories.map(c => c.items.map(i => {
  i.category = c.key
  return i
}))
.reduce((arr, a) => arr.concat(a))

let lastIdx = 0
export const resetItems = () => lastIdx = 0
export const getNextItems = () => {
  const nextItems = items.slice(lastIdx, (lastIdx + 50))
  lastIdx += 50
  return nextItems
}

export const getOptions = (categoryIdx, itemIdx) => ({
  category: categories[categoryIdx],
  item: items[itemIdx],
  options: items[itemIdx].options,
})
