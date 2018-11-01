const checkLocalCache = require('./index.js')

const test = async () => {
  const path = `https-bl-ocks-org-micahstubbs-raw-fa129089b7989975e96b166077f74de4-thumbnail.png`
  const result = await checkLocalCache({ path })
  console.log(result)
}

test()
