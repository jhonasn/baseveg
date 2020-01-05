import { configStore as store } from './baseDb'

export default {
  getTheme: async () => (await store.get('isLightTheme')).value,

  setTheme: async (isLightTheme) =>
    await store.put({ id: 'isLightTheme', value: isLightTheme }),

  getIsSearchTipPresented: async () =>
    (await store.get('isSearchTipPresented')).value,

  setIsSearchTipPresented: async () =>
    await store.put({
      id: 'isSearchTipPresented', value: true
    }),
}
