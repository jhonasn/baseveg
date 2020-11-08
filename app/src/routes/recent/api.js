import { recentStore as store } from 'api/base-db'
import categoryApi from '../list/categories/api'
import itemApi from '../list/items/api'

const apis = {
  category: categoryApi,
  item: itemApi,
}

export const api = {
  async load() {
    const tx = await store.getTx()
    const idx = tx.store.index('date')
    const recents = []

    for await (const cursor of idx.iterate(null, 'prev')) {
      recents.push(cursor.value)
    }

    // remove search recents
    const typeItemRequests = recents.filter(r => r.type !== 'search')
      .map(r => {
        const id = Number(r.typeId) || r.typeId
        return apis[r.type].get(id)
      })

    const typeItems = await Promise.all(typeItemRequests)

    let i = 0
    return recents.map(r => r.type === 'search'
      ? { ...r, name: r.typeId }
      : {
        ...typeItems[i++],
        ...r,
      }
    )
  },

  add: async (type, typeId) => await store.add({ type, typeId, date: new Date() }),

  remove: async id => await store.delete(id, true),

  clear: async () => await store.clear(),
}

export default api
