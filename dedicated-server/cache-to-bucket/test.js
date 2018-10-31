const cacheToBucket = require('./index.js')

const filename = `https-bl-ocks-org-micahstubbs-raw-fa129089b7989975e96b166077f74de4-thumbnail.png`
const dir = `${__dirname}`
const path = `${dir}/${filename}`
const mode = 'path'
cacheToBucket({ path, filename, mode })
