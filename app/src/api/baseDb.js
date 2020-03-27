import { openDB } from 'idb/with-async-ittr.js'
import { convertToSearchableWords } from './index'

const DB_NAME = 'vegajuda'
const DB_VERSION = 1

const storeNames = {
  config: 'config',
  recent: 'recent',
  favorites: 'favorites',
}

const defaultStoreOptions = { keyPath: 'id', autoIncrement: true }

// TODO: handle not supported error
if (!window.indexedDB) throw new Error('NOT_SUPPORTED')

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    db.createObjectStore(storeNames.config, {
      ...defaultStoreOptions, autoIncrement: false
    })
    const recentStore = db.createObjectStore(
      storeNames.recent, defaultStoreOptions
    )
    const favoritesStore = db.createObjectStore(
      storeNames.favorites, defaultStoreOptions
    )

    recentStore.createIndex('id', ['type', 'typeId'])
    favoritesStore.createIndex('id', ['type', 'typeId'])
  }
})

class StoreDb {
  constructor(storeName) {
    this.storeName = storeName
  }

  async getTx(isReadOnly = true, storeNames = [this.storeName]) {
    return (await dbPromise).transaction(
      storeNames,
      isReadOnly ? 'readonly' : 'readwrite'
    )
  }

  async getAll() {
    return (await (await dbPromise).getAll(this.storeName)) || []
  }

  async get(id) {
    return (await (await dbPromise).get(this.storeName, id)) || {}
  }

  async put(obj, avoidException = false) {
    try {
      return await (await dbPromise).put(this.storeName, obj)
    } catch (ex) {
      if (avoidException) return false
      throw ex
    }
  }

  async delete(id, avoidException = false) {
    try {
      await (await dbPromise).delete(this.storeName, id)
      return true
    } catch (ex) {
      if (avoidException) return false
      throw ex
    }
  }

  async clear () {
    return await (await dbPromise).clear(this.storeName)
  }
}

export const configStore = new StoreDb(storeNames.config)
export const recentStore = new StoreDb(storeNames.recent)
export const favoritesStore = new StoreDb(storeNames.favorites)
