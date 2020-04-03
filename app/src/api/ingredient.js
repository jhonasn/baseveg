import getData, { getNextItems } from '.'
import { convertToSearchText as toSearchable } from '.'

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

  searchFilter: (i, search) => toSearchable(i.name).includes(search) ||
    (i.descriptionShort && toSearchable(i.descriptionShort).includes(search)) ||
    (i.otherNames && i.otherNames.some(n => toSearchable(n).includes(search))) ||
    (i.description && toSearchable(i.description).includes(search)) ||
    (i.use && toSearchable(i.use).includes()) ||
    (i.alternatives && i.alternatives.some(a => toSearchable(a).includes(search)))
}

export default api
