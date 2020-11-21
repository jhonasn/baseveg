const write = require('fs').writeFileSync
const manifest = require('./manifest.json')

manifest.start_url = '/baseveg/'
write('./manifest.json', JSON.stringify(manifest))
