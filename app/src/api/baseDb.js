import { openDB } from 'idb'

const DB_NAME = 'vegajuda'
const DB_VERSION = 1

const storeNames = {
  config: 'config',
  recent: 'recent',
  favorites: 'favorites',
}

const defaultStoreOptions = { keyPath: 'id', autoIncrement: true }
const createIndex = (store, path, unique = false) =>
  store.createIndex(path, path, { unique })

// TODO: handle not supported error
if (!window.indexedDB) throw new Error('NOT_SUPPORTED')

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    db.createObjectStore(storeNames.config, {
      ...defaultStoreOptions, autoIncrement: false
    })
    const recentStore = db.createObjectStore(storeNames.recent, defaultStoreOptions)
    const favoritesStore = db.createObjectStore(storeNames.favorites, defaultStoreOptions)

    // recent and favorites are equal
    ;['type', 'typeId', 'date'].forEach(path => {
      createIndex(recentStore, path)
      createIndex(favoritesStore, path)
    })
  }
})

class StoreDb {
  constructor(storeName) {
    this.storeName = storeName
  }

  async getTx(isReadOnly = true) {
    return (await dbPromise).transaction(
      this.storeName,
      isReadOnly ? 'readonly' : 'readwrite'
    )
  }

  async get(id) {
    return (await (await dbPromise).get(this.storeName, id)) || {}
  }

  async put(obj) {
    (await dbPromise).put(this.storeName, obj)
  }

  async delete (id) {
    (await dbPromise).delete(this.storeName, id)
  }
}

export const configStore = new StoreDb(storeNames.config)
export const recentStore = new StoreDb(storeNames.recent)
export const favoritesStore = new StoreDb(storeNames.favorites)
