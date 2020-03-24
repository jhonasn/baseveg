import { openDB } from 'idb/with-async-ittr.js'
import { convertToSearchableWords } from './index'

const DB_NAME = 'vegajuda'
const DB_VERSION = 1

const storeNames = {
  config: 'config',
  recent: 'recent',
  favorites: 'favorites',
}

const termsStores = [
  {
    store: storeNames.favorites,
    termsStoresFor: [
      'name'
    ]
  },
  {
    store: storeNames.recent,
    termsStoresFor: [
      'name'
    ]
  },
]

const defaultStoreOptions = { keyPath: 'id', autoIncrement: true }

export const getTermsStoreName = (storeName, field) =>
  `${storeName}${field[0].toUpperCase()}${field.substring(1)}Terms`

const createTermsStoreFor = (db, storeName, field) => {
  const termsStoreName = getTermsStoreName(storeName, field)
  const store = db.createObjectStore(termsStoreName, defaultStoreOptions)
  store.createIndex('term', 'term')
  store.createIndex('storeId', 'storeId')
}

const getTermsStoreConfig = storeName => termsStores.find(ts =>
  ts.store === storeName
)

class TermRecord {
  constructor(field, storeName, term, storeId, id) {
    this.term = term
    this.storeId = storeId
    if (id) this.id = id
  }
}

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

    // create terms stores
    Object.values(storeNames).forEach(storeName => {
      const termsStoresForStore = getTermsStoreConfig(storeName)
      if (termsStoresForStore) {
        termsStoresForStore.termsStoresFor.forEach(field =>
          createTermsStoreFor(db, storeName, field)
        )
      }
    })
  }
})

class StoreDb {
  constructor(storeName) {
    this.storeName = storeName
    this.termsStoreFields = (getTermsStoreConfig(this.storeName) || {})
      .termsStoresFor || []
    this.termsStoreNames = this.termsStoreFields.map(field =>
      getTermsStoreName(this.storeName, field)
    )
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
      if (this.termsStoreNames) {
        const tx = await this.getTx(false, [
          this.storeName, ...this.termsStoreNames
        ])

        try {
          // delete old related terms
          if (obj.id) {
            this.termsStoreNames.forEach(async tsName => {
              const store = tx.objectStore(tsName)
              for await (const cursor of store.index('storeId')
                                              .iterate(obj.id)) {
                cursor.delete()
              }
            })
          }

          // remove terms fields from original object and
          // hold them converted to searchable form to save
          const terms = {}
          this.termsStoreFields.forEach(field => {
            terms[field] = convertToSearchableWords(obj[field])
            delete obj[field]
          })

          const storeId = await tx.objectStore(this.storeName).put(obj)

          this.termsStoreFields.forEach(field => {
            const tsName = getTermsStoreName(this.storeName, field)

            // save terms
            terms[field].forEach(term => tx.objectStore(tsName).put(
                new TermRecord(
                  this.storeName, field, term, storeId
                )
            ))
          })

          await tx.complete
          return storeId
        } catch { tx.abort() }
      } else return await (await dbPromise).put(this.storeName, obj)
    } catch (ex) {
      if (avoidException) return false
      throw ex
    }
  }

  async delete (id, avoidException = false) {
    const tx = await this.getTx(false, [
      this.storeName, ...this.termsStoreNames
    ])

    try {
      // delete terms if exists
      if (this.termsStoreNames) {
        this.termsStoreNames.forEach(async tsName => {
          const store = tx.objectStore(tsName)
          for await (const cursor of store.index('storeId')
                                          .iterate(id)) {
            cursor.delete()
          }
        })

        await tx.complete
      }

      // then delete the record
      await tx.objectStore(this.storeName).delete(id)
      return true
    } catch (ex) {
      tx.abort()
      if (avoidException) return false
      throw ex
    }
  }

  async searchTerms (field, query) {
    const queryTerms = convertToSearchableWords(query)

    const termsStoreName = getTermsStoreName(this.storeName, field)
    const store = (await this.getTx(true, [termsStoreName])).store
    const idx = store.index('term')

    const resultsIds = []

    for (const query of queryTerms) {
      const filter = IDBKeyRange.bound(query, `${query}\uffff`)

      const results = (await idx.getAll(filter)).map(r => r.storeId)
      // remove duplicates
      const newResultIds = Object.keys(results.reduce((obj, id) => ({
        ...obj, [id]: true
      }), {})).map(id => Number(id))

      resultsIds.push(...newResultIds)
    }

    return Promise.all(resultsIds.map(async id => await this.get(id), []))
  }
}

export const configStore = new StoreDb(storeNames.config)
export const recentStore = new StoreDb(storeNames.recent)
export const favoritesStore = new StoreDb(storeNames.favorites)
