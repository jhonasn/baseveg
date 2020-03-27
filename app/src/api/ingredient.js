import getData, { getNextItems } from '.'

const api = {
  _load: async () => (await getData()).ingredients,

  async loadNext() {
    const ingredients = await api._load()

    return Promise.all(
      ingredients.slice(0, 8).concat(
        ingredients.filter(i => i.otherNames && i.otherNames.length > 1).slice(0, 2)
      ).concat(
        ingredients.filter(i => i.alternatives).slice(0, 3)
      ).concat(
        ingredients.filter(i => i.type === 'animal').slice(0, 5)
      ).concat(
        ingredients.filter(i => i.type === 'milk').slice(0, 5)
      ).map(async i => ({
        ...i, font: await api.getFont(i.fontId)
      }))
    )
  },

  getFont: async id => (await getData()).fonts.find(f => f.id === id),

  async get(id) {
    const i = (await api._load()).find(i => i.id === id)
    i.font = await api.getFont(i.fontId)
    return i
  },
}

export default api
