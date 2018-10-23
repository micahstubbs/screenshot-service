const checkCache = require('./check-cache.js')

const filename = 'crossfilter-block.png'
const found = await checkCache(filename)
console.log(`found ${filename}? ${found}`)
