import { convertToSeachText } from '.'
import categoryApi from './category'
import itemApi from './item'
import optionApi from './option'
import ingredientApi from './ingredient'

const api = {
  async query(search) {
    const categories = await categoryApi.load()
    const items = await itemApi._load()
    const options = await optionApi._load()
    const ingredients = await ingredientApi._load()

    const searchTerm = convertToSeachText(search)

    // filter for categories, items and options
    const searchOnList = list => list.filter(i =>
      itemApi.searchFilter(i, searchTerm)
    )

    const categoriesResult = searchOnList(categories)
    const itemsResult = searchOnList(items)
    const optionsResult = searchOnList(options)
    const ingredientsResult = ingredients.filter(i =>
      ingredientApi.searchFilter(i, searchTerm)
    )

    // bold ingredient results
    ingredientsResult.forEach(i => {
      i.name = api.boldResult(search, i.name)
      if (i.description) i.description = api.boldResult(search, i.description)
      if (i.descriptionShort) i.descriptionShort = api.boldResult(search, i.descriptionShort)
      if (i.use) i.use = api.boldResult(search, i.use)
      if (i.alternatives) i.alternatives = i.alternatives.map(a =>
        api.boldResult(search, a)
      )
      if (i.otherNames) i.otherNames = i.otherNames.map(o =>
        api.boldResult(search, o)
      )
    })

    return {
      categories: api.hierarchizeAndBoldResult(searchTerm, {
        categories, items, options
      }, {
        categories: categoriesResult, items: itemsResult, options: optionsResult
      }),
      ingredients: ingredientsResult,
      total: categoriesResult.length + itemsResult.length +
        optionsResult.length + ingredientsResult.length
    }
  },

  boldResult(searchTerm, field) {
    if (typeof field !== 'string' ||
      !convertToSeachText(field).includes(searchTerm)) return field
    let result = []
    let idx = 0

    for (const res of convertToSeachText(field).matchAll(new RegExp(searchTerm, 'gi'))) {
      const endRes = res.index + res[0].length
      const begin = field.substring(idx, res.index)
      const end = field.substring(res.index, endRes)

      if (begin) result.push({ content: begin })
      result.push({ content: end, bold: true })

      idx = endRes
    }

    result.push({ content: field.substring(idx) })

    return result
  },

  boldItemResult(searchTerm, item) {
    const bold = api.boldResult
    item.name = bold(searchTerm, item.name)
    if (item.obs) {
      if (item.obs.observations) item.obs.observations = bold(searchTerm, item.obs.observations)
      if (item.obs.only) item.obs.only = bold(searchTerm, item.obs.only)
      if (item.obs.except) item.obs.except = bold(searchTerm, item.obs.except)
      if (item.obs.warning) item.obs.warning = bold(searchTerm, item.obs.warning)
    }
  },

  hierarchizeAndBoldResult(searchTerm, collections, results) {
    const result = [...results.categories]
    result.forEach(c => c.name = api.boldResult(searchTerm, c.name))

    results.options.forEach(o => {
      let item = results.items.find(i => i.id === o.itemId)
      if (!item) item = collections.items.find(i => i.id === o.itemId)
      let category = results.categories.find(c => c.id === item.categoryId)
      if (!category) category = collections.categories.find(c => c.id === item.categoryId)

      category.items = category.items || []
      category.items.push(item)
      item.options = item.options || []
      item.options.push(o)

      if (!result.some(c => c.id === category.id)) result.push(category)

      api.boldItemResult(searchTerm, o)
    })

    results.items.forEach(i => {
      let category = results.categories.find(c => c.id === i.categoryId)
      if (!category) category = collections.categories.find(c => c.id === i.categoryId)

      category.items = category.items || []
      category.items.push(i)

      if (!result.some(c => c.id === category.id)) result.push(category)

      api.boldItemResult(searchTerm, i)
    })

    return result
  },
}

export default api
