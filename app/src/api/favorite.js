import { favoritesStore as store } from './baseDb'
import itemApi from './item'
import optionApi from './option'

const getItem = itemApi.get
const getOption = optionApi.get

const api = {
  get: async (type, id) => {
    const idx = (await store.getTx()).store.index('id')
    const favorite = idx.get([type, id])
    return favorite
  },

  isFavorite: async (type, id) => !!await api.get(type, id),

  /** Toggle item into the favorites
  @return {Boolean} is favorite state;
  */
  save: async (type, id) => {
    const favorite = await api.get(type, id)

    if (!favorite) {
      const { name } = (type === 'item' ? getItem : getOption)(id)
      return await store.put({ type, typeId: id, name }, true)
    } else return !(await store.delete(favorite.id), true)
  },

  query: async (search = '') => {
    const mapFavorites = (favorite) => {
      const { type, typeId: id } = favorite
      if (type === 'item') return { ...favorite, ...getItem(id) }
      else return { ...favorite, ...getOption(id) }
    }

    const favorites = await store.searchTerms('name', search)
    return favorites.map(mapFavorites) || []
  }
}

export default api
