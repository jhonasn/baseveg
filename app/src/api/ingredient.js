import getData, { getNextItems } from '.'

const api = {
  async _load() {
    const data = await getData()
    return data.ingredients.map(i => ({
      ...i, font: data.fonts.find(f => f.id === i.fontId)
    }))
  },

  loadNext: async lastId => getNextItems(await api._load(), lastId),

  get: async id => (await api._load()).find(i => i.id === id),

  count: async () => (await api._load()).length,

  searchFilter: (i, search) => i.name.includes(search) ||
    (i.descriptionShort && i.descriptionShort.includes(search)) ||
    (i.otherNames && i.otherNames.some(n => n.includes(search))) ||
    (i.description && i.description.includes(search)) ||
    (i.use && i.use.includes()) ||
    (i.alternatives && i.alternatives.some(a => a.includes(search)))
}

export default api
