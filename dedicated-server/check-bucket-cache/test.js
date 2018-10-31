const checkBucketCache = require('./index.js')

const test = async () => {
  // const filename = 'crossfilter-block.png'
  const filename = 'https-bl-ocks-org-jadonk-raw-397547-thumbnail.png'
  const found = await checkBucketCache(filename)
  console.log(`found ${filename}? ${found}`)
}

test()
