import getData, { getNextItems } from '.'

const api = {
  _load: async () => (await getData()).ingredients,

  async load() {
    const ingredients = await api._load()

    const mapOtherIngredients = (type, i) => ({
      type,
      name: i,
      descriptionShort: ingredients[type].descriptionShort,
      fontId: ingredients[type].fontId,
    })

    return Promise.all(
      ingredients.general.slice(0, 8)
        .concat(ingredients.general
          .filter(i => i.otherNames && i.otherNames.length > 1).slice(0, 2))
        .concat(ingredients.general.filter(i => i.alternatives).slice(0, 3))
        .concat(ingredients.animal.ingredients.slice(0, 5)
          .map(mapOtherIngredients.bind(null, 'animal'))
        )
        .concat(ingredients.milk.ingredients.slice(0, 5)
          .map(mapOtherIngredients.bind(null, 'milk'))
        )
        .map(async i => ({ ...i, font: await api.getFont(i.fontId) }))
    )
  },

  loadNext: async lastId => getNextItems(await this.load(), lastId),

  getFont: async id => (await api._load()).links.find(l => l.id === id),
}

export default api
