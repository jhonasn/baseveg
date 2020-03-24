import { favoritesStore as store } from './baseDb'
import { findItem, findOption } from './index'

const favoritesApi = {
  get: async (type, id) => {
    const idx = (await store.getTx()).store.index('id')
    const favorite = idx.get([type, id])
    return favorite
  },

  isFavorite: async (type, id) => !!await favoritesApi.get(type, id),

  /** Toggle item into the favorites
  @return {Boolean} is favorite state;
  */
  save: async (type, id) => {
    const favorite = await favoritesApi.get(type, id)

    if (!favorite) {
      const { name } = (type === 'item' ? findItem : findOption)(id)
      return await store.put({ type, typeId: id, name }, true)
    } else return !(await store.delete(favorite.id), true)
  },

  query: async (search = '') => {
    const mapFavorites = (favorite) => {
      const { type, typeId: id } = favorite
      if (type === 'item') return { ...favorite, ...findItem(id) }
      else return { ...favorite, ...findOption(id) }
    }

    // if (!search) return (await store.getAll()).map(mapFavorites)

    const favorites = await store.searchTerms('name', search)
    return favorites.map(mapFavorites) || []
  }
}

export default favoritesApi
