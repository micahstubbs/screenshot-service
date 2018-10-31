const cacheToBucket = require('./index.js')

const filename = `https-bl-ocks-org-micahstubbs-raw-3e931f7b5876254d7156a85cdd286f7b-thumbnail.png`
const dir = `${__dirname}/../screenshots`
const path = `${dir}/${filename}`
cacheToBucket({ path, filename })
