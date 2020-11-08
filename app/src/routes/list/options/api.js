import getData from 'api'
import itemApi from '../items/api'

const api = {
  _load: async () => itemApi.loadWithObservations(await getData(), 'options'),

  load: async itemId => (await api._load()).filter(o => o.itemId === itemId),

  get: async id => (await api._load()).find(o => o.id === id),
}

export default api
