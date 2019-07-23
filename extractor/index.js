import load from './lib/load.js'
import extract from './lib/extract/index.js'
import map from './lib/map.js'

(async () => {
  const data = await load()
  extract(data)
  map()

  console.info('Extraction completed')
})()
