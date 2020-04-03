import getData, { getNextItems } from '.'
import { convertToSearchText as toSearchable } from '.'

const api = {
  loadWithObservations: (data, collection) => data[collection].map(i => ({
    ...i, obs: data.observations.find(o => o.id === i.obsId)
  })),

  _load: async () => api.loadWithObservations(await getData(), 'items'),

  loadNext: async (categoryId, lastId) => getNextItems(
    (await api._load()).filter(i => i.categoryId === categoryId),
    lastId,
  ),

  get: async id => (await api._load()).find(i => i.id === id),

  // valid for item and option since the model currently is the equal
  searchFilter: (i, search) => toSearchable(i.name).includes(search) ||
    (i.obs && (
      (i.obs.observations && toSearchable(i.obs.observations).includes(search)) ||
      (i.obs.only && toSearchable(i.obs.only).includes(search)) ||
      (i.obs.except && toSearchable(i.obs.except).includes(search)) ||
      (i.obs.warning && toSearchable(i.obs.warning).includes(search))
    ))
}

export default api
