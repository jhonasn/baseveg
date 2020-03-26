import { favoritesStore as store } from './baseDb'
import itemApi from './item'
import optionApi from './option'

const getItem = itemApi.get
const getOption = optionApi.get

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
      const { name } = await (type === 'item' ? getItem : getOption)(id)
      return await store.put({ type, typeId: id, name }, true)
    } else return !(await store.delete(favorite.id), true)
  },

  async query(search = '') {
    const mapFavorites = ({ typeId: id, type }) => (type === 'item'
      ? getItem : getOption)(id)

    const favorites = await store.searchTerms('name', search)
    const mapped = await Promise.all(favorites.map(mapFavorites))
    return favorites.map(f => ({
      ...mapped.find(m => f.typeId === m.id),
      ...f,
    }))
  }
}

export default api
