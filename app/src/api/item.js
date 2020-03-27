import getData, { getNextItems } from '.'

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
  searchFilter: (i, search) => i.name.includes(search) ||
    (i.obs && (
      (i.obs.observations && i.obs.observations.includes(search)) ||
      (i.obs.only && i.obs.only.includes(search)) ||
      (i.obs.except && i.obs.except.includes(search)) ||
      (i.obs.warning && i.obs.warning.includes(search))
    ))
}

export default api
