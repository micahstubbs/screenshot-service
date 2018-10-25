const checkCache = require('./check-cache.js')

const fn = async () => {
  const filename = 'crossfilter-block.png'
  const found = await checkCache(filename)
  console.log(`found ${filename}? ${found}`)
}

fn()
