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
  async load() {
    const getFavoriteType = ({ typeId: id, type }) => apis[type].get(id)

    const favorites = await store.getAll()
    const typeItems = await Promise.all(favorites.map(getFavoriteType))

    // favorite with type fields (override type fields by favorite fields)
    return favorites.map((f, idx) => ({
      ...typeItems[idx], ...f
    }))
  },

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
    return this.load().filter(f =>
      (f.type === 'ingredient' && ingredientApi.searchFilter(f, search)) ||
      (f.type !== 'ingredient' && itemApi.searchFilter(f, search))
    )
  }
}

export default api
