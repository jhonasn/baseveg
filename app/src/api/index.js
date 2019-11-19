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

const removeDiacritics = text => text.normalize('NFD')
  .replace(/[\u0300-\u036f]/g, "")

export const query = search => {
  const searchTerm = removeDiacritics(search.toLowerCase())
  const searchFilter = i => i && removeDiacritics(i.name.toLowerCase())
    .includes(searchTerm)
  const boldResult = i => {
    let result = []
    let idx = 0

    for (const res of removeDiacritics(i.name).matchAll(new RegExp(searchTerm, 'gi'))) {
      const endRes = res.index + res[0].length
      const begin = i.name.substring(idx, res.index)
      const end = i.name.substring(res.index, endRes)

      if (begin) result.push({ content: begin })
      result.push({ content: end, bold: true })

      idx = endRes
    }

    result.push({ content: i.name.substring(idx) })

    return { ...i, name: result }
  }

  const searchOnList = list => list.filter(searchFilter).map(boldResult)

  const categoriesResult = searchOnList(categories)
  const itemsResult = searchOnList(items)
  const optionsResult = searchOnList(options)

  const result = []
  categories.forEach(c => {
    let included = false
    const cat = { ...c, items: [] }
    const includeCategory = (includeItems, includeOptions) => {
      if (!included) result.push(cat)
      included = true
    }
    const findCategory = i => i.category === c.key

    const inCategories = categoriesResult.find(cr => cr.key === c.key)
    if (!included && inCategories) {
      cat.name = inCategories.name
      includeCategory()
    }

    const inItems = itemsResult.some(findCategory)
    if (inItems) {
      includeCategory()
      const categoryItems = itemsResult.filter(findCategory)
        .map(i => ({ ...i, options: [] }))
      cat.items.push(...categoryItems)
    }

    const inOptions = optionsResult.some(findCategory)
    if (inOptions) {
      if (!included) includeCategory()
      const categoryOptions = optionsResult.filter(findCategory)
      categoryOptions.forEach(o => {
        const findItem = i => i.key === o.item
        let item = cat.items.find(findItem)
        if (!item) {
          const i = items.find(findItem)
          item = { ...i, options: [] }
          cat.items.push(item)
        }
        item.options.push(o)
      })
    }
  })

  return result
}
