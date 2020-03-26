import getData, { getNextItems } from '.'

const api = {
  _load: async () => (await getData()).items,

  loadNext: async (categoryId, lastId) => getNextItems(
    (await api._load()).filter(i => i.categoryId === categoryId),
    lastId,
  ),

  get: async id => (await api._load()).find(i => i.id === id),
}

export default api
