import getData from '.'
import itemApi from './item'

const api = {
  _load: async () => itemApi.loadWithObservations(await getData(), 'options'),

  load: async itemId => (await api._load()).filter(o => o.itemId === itemId),

  get: async id => (await api._load()).find(o => o.id === id),
}

export default api
