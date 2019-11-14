import data from '../data.json'

export const categories = data.categories.map(({ key, name, parent }) => ({
  key, name, parent
}))

const createItems = () => {
  let idx = 0
  return data.categories.map(c => c.items.map(i => {
    i.key = idx++
    i.category = c.key
    return i
  }))
  .reduce((arr, a) => arr.concat(a))
}

const items = createItems()

let lastCategoryKey = null
let lastIdx = 0
export const getNextItems = (categoryKey) => {
  if (lastCategoryKey !== categoryKey) {
    lastIdx = items.findIndex(i => i.category === categoryKey)
  }
  const nextItems = items.slice(lastIdx, (lastIdx + 50))
  lastIdx += 50
  return nextItems
}

export const getOptions = (categoryId, itemId) => ({
  category: categories.find(c => c.key === categoryId),
  item: items[itemId],
  options: items[itemId].options,
})
