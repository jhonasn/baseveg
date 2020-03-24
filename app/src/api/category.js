import getData from '.'

export const api = {
  async load() {
    const data = await getData()
    return data.categories
  },

  async get(id) {
    return (await api.load()).find(c => c.id === id)
  },
}

export default api
