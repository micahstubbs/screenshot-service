const checkCache = require('./check-cache.js')

const filename = 'crossfilter-block.png'
const found = checkCache(filename)
console.log(`found ${filename}? ${JSON.stringify(found, null, 2)}`)
