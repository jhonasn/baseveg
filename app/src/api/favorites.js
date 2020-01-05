import { favoritesStore as store } from './baseDb'

export default {
  isFavorite: async (type, id) => {
    const tx = store.getTx()

  },

  save: async (type, id) =>
    await store.put({ id: 'isLightTheme', value: isLightTheme }),
}
