import getData from '.'

const api = {
  async _load() {
    return (await getData()).items
  },

  async loadNext(categoryId, cursor) {
    return (await api._load())
      .filter(i => i.categoryId === categoryId)
      .slice(0, 100)
  },

  async get(id) {
    return (await api._load()).find(i => i.id === id)
  },
}

export default api
