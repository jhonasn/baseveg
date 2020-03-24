import getData from '.'

const api = {
  async _load() {
    return (await getData()).options
  },

  async load(itemId) {
    const options = await api._load()
    return options.filter(o => o.itemId === itemId)
  },

  async get(id) {
    const options = await api._load()
    return options.find(o => o.id === id)
  },
}

export default api
