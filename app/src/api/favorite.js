import { favoritesStore as store } from './baseDb'
import itemApi from './item'
import optionApi from './option'
import ingredientApi from './ingredient'

const apis = {
  item: itemApi,
  option: optionApi,
  ingredient: ingredientApi,
}

const api = {
  async get(type, id) {
    const idx = (await store.getTx()).store.index('id')
    const favorite = await idx.get([type, id])
    return favorite
  },

  isFavorite: async (type, id) => !!await api.get(type, id),

  /** Toggle item into the favorites
  @return {Boolean} is favorite state;
  */
  async save(type, id) {
    const favorite = await api.get(type, id)

    if (!favorite) {
      const { name } = await apis[type].get(id)
      return await store.put({ type, typeId: id, name }, true)
    } else return !(await store.delete(favorite.id), true)
  },

  async query(search = '') {
    const getFavoriteType = ({ typeId: id, type }) => apis[type].get(id)

    const favorites = await store.searchTerms('name', search)
    const typeItems = await Promise.all(favorites.map(getFavoriteType))
    return favorites.map((f, idx) => ({
      ...typeItems[idx], ...f
    }))
  }
}

export default api
