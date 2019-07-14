import load from './lib/load.js'
import extract from './lib/extract/index.js'

(async () => {
  const data = await load()
  extract(data)

  console.info('Extraction completed')
})()
