import getData from '.'

const api = {
  _load: async () => (await getData()).options,

  load: async itemId => (await api._load()).filter(o => o.itemId === itemId),

  get: async id => (await api._load()).find(o => o.id === id),
}

export default api
