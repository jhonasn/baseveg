import data from '../data.json'

export const categories = data.categories.map(({ key, name, parent }) => ({
  key, name, parent
}))

const decoupleLists = () => {
  let idx = 0
  let oidx = 0
  const options = []
  const items = data.categories.map(c => c.items.map(i => {
    i.key = idx++
    i.category = c.key
    options.push(...i.options.map(o => {
      o.key = oidx++
      o.item = i.key
      o.category = i.category
      return o
    }))
    return i
  }))
  .reduce((arr, a) => arr.concat(a))

  return { items, options }
}

const { items, options } = decoupleLists()

let lastCategoryKey = null
let lastIdx = 0
export const resetCategory = () => lastCategoryKey = null
export const getNextItems = categoryKey => {
  if (lastCategoryKey !== categoryKey) {
    lastIdx = items.findIndex(i => i.category === categoryKey)
  }
  const nextItems = items.filter(i => i.category === categoryKey &&
    i.key >= lastIdx && i.key <= (lastIdx + 50))
  lastIdx += 50
  lastCategoryKey = categoryKey
  return nextItems
}

export const getOptions = (categoryId, itemId) => ({
  category: categories.find(c => c.key === categoryId),
  item: items[itemId],
  options: items[itemId].options,
})

export const query = search => {
  const searchTerm = search.toLowerCase()
  const searchFilter = i => i && i.name.toLowerCase().includes(searchTerm)
  const boldResult = i => {
    let result = ''
    let idx = 0

    for (const res of i.name.matchAll(new RegExp(searchTerm, 'gi'))) {
      const endRes = res.index + res[0].length
      const begin = i.name.substring(idx, res.index)
      const end = i.name.substring(res.index, endRes)

      result =
      `${result}${begin}<b>${end}</b>`

      idx = endRes
    }

    result = `${result}${i.name.substring(idx)}`

    return { ...i, name: { __html: result} }
  }

  return {
    categories: categories.filter(searchFilter).map(boldResult),
    items: items.filter(searchFilter).map(boldResult),
    options: options.filter(searchFilter).map(boldResult),
  }
}
