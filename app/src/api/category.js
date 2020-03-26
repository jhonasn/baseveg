import getData from '.'

export const api = {
  load: async () => (await getData()).categories,

  get: async id => (await api.load()).find(c => c.id === id),
}

export default api
