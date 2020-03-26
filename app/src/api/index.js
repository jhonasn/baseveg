export const removeDiacritics = text => text.normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  // remove non alfanumeric chars too
  .replace(/[^A-z\d\s]/g, '')

export const convertToSeachText = text => removeDiacritics(text.toLowerCase())

export const convertToSearchableWords = text => Object.keys(
  // remove duplicated words
  convertToSeachText(text).split(' ').reduce((obj, val) => ({
    ...obj, [val]: true,
  }), {})
)

export function getNextItems(collection, lastId, chunkSize = 50) {
  const idx = collection.findIndex(i => i.id === lastId) + 1
  return collection.slice(idx, idx + chunkSize)
}

const getData = async () => {
  const response = await fetch(`${process.env.PUBLIC_URL}/data.json`)
  return await response.json()
}

export default getData

export async function query(search) {
  // BUG: options repeating in items, inclusive options of another item
  const { categories, items, options } = await getData()
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
